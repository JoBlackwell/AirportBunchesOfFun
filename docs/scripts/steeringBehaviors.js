// JavaScript Document

/*---------------------steeringBehavior-------------------------------\
| - Class to encapsulate steering behaviors for an entity
\--------------------------------------------------------------------*/

/*---------------------Enumerators------------------------------------\
| - Define the necessary enumerators
\--------------------------------------------------------------------*/

const summingMethodEnum = Object.freeze({
	"weighted_average":"weighted_average",
	"prioritized":"prioritized",
	"dithered":"dithered"
});

const behaviorTypeEnum = Object.freeze({
	"none":0x00000,
	"seek":0x00002,
	"arrive":0x00008,
	"wander":0x00010,
	"separation":0x00040,
	"wall_avoidance":0x00200
});

const decelerationEnum = Object.freeze({
	"slow":3,
	"normal":2,
	"fast":1
});

class steeringBehavior {
	constructor(shape) {
		if (typeof shape !== "undefined") {
			this.shape = shape;
		} else {
			console.log("<SteeringBehavior:Constructor> Shape is null.");
			return null;
		}
		
		// The steering force created by the combined effect of all the selected behaviors (Vector2D)
		this.steeringForce;
		
		// The current target (Vector2D)
		this.target;
		
		// (Binary) flag to indicate whether or not a behavior should be active - start with none:0
		this.flags = 0;
		
		// Define the separation weight
		this.weightSeparation = 0.0;
		
		// Define the wander weight
		this.weightWander = 0.0;
		
		// Define the wall avoidance weight
		this.weightWallAvoidance = 0.0;
		
		// Define the view distance
		this.viewDistance = 10.0;
		
		// Define wall detection feeler length
		this.wallDetectionFeelerLength = 4.0;
		
		// Define the number of feelers to use
		this.feelers = 3;
		
		// Define the deceleration rate category
		this.deceleration = decelerationEnum.normal;
		
		// Define two target shapes as null
		this.targetShape1 = null;
		this.targetShape2 = null;
		
		// Define the wander distance
		this.wanderDistance = 2.0;
		
		// Define the wander jitter
		this.wanderJitter = 40.0;
		
		// Define the wander radius
		this.wanderRadius = 1.19999999956;
		
		// Define the seek weight
		this.weightSeek = 0.5;
		
		// Define the arrive weight
		this.weightArrive = 0.5;
		
		// Define the summing method
		this.summingMethod = summingMethodEnum.prioritized;
		
		// Azimuth for wander behavior
		this.theta = randFloat() * TwoPi;
		
		// Create a vector to a target position on the wander circle
		this.wanderTarget = new Vector2D(this.wanderRadius * Math.cos(this.theta), this.wanderRadius * Math.sin(this.theta));
	}
	
	/*---------------------flagOn-----------------------------------------\
	| - Tests if a specific bit of this.flag is set
	\--------------------------------------------------------------------*/
	flagOn(bt) {
		return (this.flags & bt) == bt;
	}
	
	/*---------------------Calculate Methods------------------------------\
	\--------------------------------------------------------------------*/
	
	/*---------------------calculate--------------------------------------\
	| - Calculates the accumulated steering force according to the method
	|   set in summingMethod
	\--------------------------------------------------------------------*/
	calculate() {
		// Reset the steering force
		this.steeringForce.zero();
		
		// Tag neighbors if any of the following 3 group behaviors are switched on
		if (this.flagOn(behaviorTypeEnum.separation)) {
			game.tagShapesWithinViewRange(this.shape, this.viewDistance);
		}

		this.steeringForce = this.calculatePrioritized();

		return this.steeringForce;
	}

	/*---------------------forwardComponent-------------------------------\
	| - Returns the forward component of the steering force
	\--------------------------------------------------------------------*/
	forwardComponent()
	{
		return this.shape.getHeading().dot(this.steeringForce);
	}

	/*---------------------sideComponent----------------------------------\
	| - Returns the side component of the steering force
	\--------------------------------------------------------------------*/
	sideComponent()
	{
		return this.shape.getSide().dot(this.steeringForce);
	}

	/*---------------------accumulateForce--------------------------------\
	| - This function calculates how much of its max steering force the
	|   entity has left to apply and then applies that amount of the force
	|   to add.
	| - arg types: Vector2D | Vector2D
	\--------------------------------------------------------------------*/
	accumulateForce(RunningTot, ForceToAdd) {
		// Calculate how much steering force the vehicle has used so far
		var MagnitudeSoFar = RunningTot.length();

		// Calculate how much steering force remains to be used by this vehicle
		// double MagnitudeRemaining = m_pLH_Bot->MaxForce() - MagnitudeSoFar;
		var MagnitudeRemaining = this.shape.getMaxForce() - MagnitudeSoFar;

		// Return false if there is no more force left to use
		if (MagnitudeRemaining <= 0.0) return false;

		// Calculate the magnitude of the force we want to add
		// double MagnitudeToAdd = ForceToAdd.Length();
		var MagnitudeToAdd = ForceToAdd.length();

		// If the magnitude of the sum of ForceToAdd and the running total
		// does not exceed the maximum force available to this vehicle, just
		// add together. Otherwise add as much of the ForceToAdd vector is
		// possible without going over the max.
		if (MagnitudeToAdd < MagnitudeRemaining) {
			// RunningTot += ForceToAdd;
			RunningTot = vecAdd(RunningTot, ForceToAdd);
		} else {
			MagnitudeToAdd = MagnitudeRemaining;

			// Add it to the steering force
			// RunningTot += (Vec2DNormalize(ForceToAdd) * MagnitudeToAdd);
			RunningTot = vecAdd(RunningTot, vecMultiply(vec2DNormalize(ForceToAdd), MagnitudeToAdd));
		}

		return true;
	}

	/*---------------------calculatePrioritized---------------------------\
	| - This method calls each active steering behavior in order of
	|   priority and accumulates their forces until the max steering force
	|   magnitued is reached, at which time the function returns the
	|   steering force accumulated to that point.
	\--------------------------------------------------------------------*/
	calculatePrioritized()
	{
		// Vector2D force;
		var force = new Vector2D();

		/*if (On(wall_avoidance))
		{
			force = WallAvoidance(m_pWorld->GetMap()->GetWalls()) *
				m_dWeightWallAvoidance;

			if (!AccumulateForce(m_vSteeringForce, force)) return m_vSteeringForce;
		}*/
		if (this.flagOn(behaviorTypeEnum.wall_avoidance)) {
			force = this.wallAvoidance(game.walls.getWalls()) * this.weightWallAvoidance;
			if (!this.accumulateForce(this.steeringForce, force)) return this.steeringForce;
		}

		// These next three can be combined for flocking behavior (wander is
		// also a good behavior to add into this mix)

		/*if (On(separation))
		{
			force = Separation(m_pWorld->GetAllBots()) * m_dWeightSeparation;

			if (!AccumulateForce(m_vSteeringForce, force)) return m_vSteeringForce;
		}*/

		if (this.flagsOn(behaviorTypeEnum.separation)) {
			force = this.separation(game.shapes) * this.weightSeparation;
			if (!this.accumulateForce(this.steeringForce, force)) return this.steeringForce
		}

		/*if (On(seek))
		{
			force = Seek(m_vTarget) * m_dWeightSeek;

			if (!AccumulateForce(m_vSteeringForce, force)) return m_vSteeringForce;
		}*/
		if (this.flagsOn(behaviorTypeEnum.seek)) {
			force = this.seek(this.target) * this.weightSeek;
			if (!this.accumulateForce(this.steeringForce, force)) return this.steeringForce;
		}

		/*if (On(arrive))
		{
			force = Arrive(m_vTarget, m_Deceleration) * m_dWeightArrive;

			if (!AccumulateForce(m_vSteeringForce, force)) return m_vSteeringForce;
		}*/
		if (this.flagsOn(behaviorTypeEnum.arrive)) {
			force = this.arrive(this.target, this.deceleration) * this.weightArrive;
			if (!this.accumulateForce(this.steeringForce, force)) return this.steeringForce;
		}

		/*if (On(wander))
		{
			force = Wander() * m_dWeightWander;

			if (!AccumulateForce(m_vSteeringForce, force)) return m_vSteeringForce;
		}*/
		if (this.flagsOn(behaviorTypeEnum.wander)) {
			force = this.wander() * this.wanderWeight;
			if (!this.accumulateForce(this.steeringForce, force)) return this.steeringForce;
		}

		return this.steeringForce;
	}

	/*---------------------Start of Behaviors-----------------------------\
	\--------------------------------------------------------------------*/

	/*---------------------seek-------------------------------------------\
	| - Given a target, this behavior returns a steering force which will
	|   direct the agent towards the target.
	| - arg types: Vector2D
	\--------------------------------------------------------------------*/
	seek(target)
	{

		// Vector2D DesiredVelocity = Vec2DNormalize(target - m_pLH_Bot->Pos()) * m_pLH_Bot->MaxSpeed();
		var DesiredVelocity = vecMultiply(vec2DNormalize(vecSubtract(target, this.shape.pos())), this.shape.getMaxSpeed());

		// return (DesiredVelocity - m_pLH_Bot->Velocity());
		return vecSubtract(DesiredVelocity, this.shape.getVelocity());
	}

	/*---------------------arrive-----------------------------------------\
	| - This behavior is similar to seek, but it attempts to arrive at the
	|   target with a zero velocity.
	| - arg types: Vector2D | decelerationEnum
	\--------------------------------------------------------------------*/
	arrive(target, deceleration) {
		// Vector2D ToTarget = target - m_pLH_Bot->Pos();
		var toTarget = vecSubtract(target, this.shapes.pos());

		// Calculate the distance to the target
		// double dist = ToTarget.Length();
		var dist = toTarget.length();

		if (dist > 0)
		{
			// Because Deceleration is enumerated as an int, this value is required
			// to provide fine tweaking of the deceleration..
			// const double DecelerationTweaker = 0.3;
			var DecelerationTweaker = 0.3;

			// Calculate the speed required to reach the target given the desired
			// deceleration
			// double speed = dist / ((double)deceleration * DecelerationTweaker);
			var speed = dist / (deceleration * DecelerationTweaker);

			// Make sure the velocity does not exceed the max
			// speed = MinOf(speed, m_pLH_Bot->MaxSpeed());
			speed = minimum(speed, this.shape.getMaxSpeed());

			// From here proceed just like seek except we don't need to normalize 
			// the toTarget vector because we have already gone to the trouble
			// of calculating its length: dist. 
			// Vector2D DesiredVelocity = ToTarget * speed / dist;
			var DesiredVelocity = vecMultiply(toTarget, vecDivide(speed, dist));

			// return (DesiredVelocity - m_pLH_Bot->Velocity());
			return vecSubtract(DesiredVelocity, this.shape.getVelocity());
		}

		var tempVec = new Vector2D();
		return tempVec;
	}

	/*---------------------wander-----------------------------------------\
	| - This behavior makes the entity wander about randomly
	\--------------------------------------------------------------------*/
	wander() {
		// First, add a small random vector to the target's position
		// m_vWanderTarget += Vector2D(RandomClamped() * m_dWanderJitter, RandomClamped() * m_dWanderJitter);
		var newWanderTarget = new Vector2D(randomClamped() * this.wanderJitter, randomClamped() * this.wanderJitter);
		this.wanderTarget = vecAdd(this.wanderTarget, newWanderTarget);

		// Reproject this new vector back on to a unit circle
		// m_vWanderTarget.Normalize();
		this.wanderTarget.normalize();

		// Increase the length of the vector to the same as the radius
		// of the wander circle
		// m_vWanderTarget *= m_dWanderRadius;
		this.wanderTarget = vecMultiply(this.wanderTarget, this.wanderRadius);

		// Move the target into a position WanderDist in front of the shape
		// Vector2D target = m_vWanderTarget + Vector2D(m_dWanderDistance, 0);
		var wanderDist = new Vector2D(this.wanderDistance, 0);
		var target = vecAdd(this.wanderTarget, wanderDist);

		// Project the target into world space
		// Vector2D Target = PointToWorldSpace(target,	m_pLH_Bot->Heading(), m_pLH_Bot->Side(), m_pLH_Bot->Pos());
		var newTarget = pointToWorldSpace(target, this.shape.getHeading(), this.shape.getSide(), this.shape.pos());

		// Steer towards it
		// return Target - m_pLH_Bot->Pos();
		return vecSubtract(newTarget, this.shape.pos());
	}

	/*---------------------wallAvoidance----------------------------------\
	| - This returns a steering force that will keep the agent away from
	|   any walls it may encounter.
	| - arg types: walls array
	\--------------------------------------------------------------------*/
	wallAvoidance(walls) {
		// The feelers are contained in an array this.feelers
		// CreateFeelers();
		this.createFeelers();

		/*double DistToThisIP = 0.0;
		double DistToClosestIP = MaxDouble;*/

		//this will hold an index into the vector of walls
		int ClosestWall = -1;

		Vector2D SteeringForce,
			point,         //used for storing temporary info
			ClosestPoint;  //holds the closest intersection point

	//examine each feeler in turn
		for (unsigned int flr = 0; flr < m_Feelers.size(); ++flr)
		{
			//run through each wall checking for any intersection points
			for (unsigned int w = 0; w < walls.size(); ++w)
			{
				if (LineIntersection2D(m_pLH_Bot->Pos(),
					m_Feelers[flr],
					walls[w]->From(),
					walls[w]->To(),
					DistToThisIP,
					point))
				{
					//is this the closest found so far? If so keep a record
					if (DistToThisIP < DistToClosestIP)
					{
						DistToClosestIP = DistToThisIP;

						ClosestWall = w;

						ClosestPoint = point;
					}
				}
			}//next wall


			//if an intersection point has been detected, calculate a force  
			//that will direct the agent away
			if (ClosestWall >= 0)
			{
				//calculate by what distance the projected position of the agent
				//will overshoot the wall
				Vector2D OverShoot = m_Feelers[flr] - ClosestPoint;

				//create a force in the direction of the wall normal, with a 
				//magnitude of the overshoot
				SteeringForce = walls[ClosestWall]->Normal() * OverShoot.Length();
			}

		}//next feeler

		return SteeringForce;
	}

	/*---------------------createFeelers----------------------------------\
	| - Creates the antenna utilized by WallAvoidance.
	\--------------------------------------------------------------------*/
	createFeelers()	{
		// Feeler pointing straight in front
		m_Feelers[0] = m_pLH_Bot->Pos() + m_dWallDetectionFeelerLength *
			m_pLH_Bot->Heading() * m_pLH_Bot->Speed();

		// Feeler to left
		Vector2D temp = m_pLH_Bot->Heading();
		Vec2DRotateAroundOrigin(temp, HalfPi * 3.5);
		m_Feelers[1] = m_pLH_Bot->Pos() + m_dWallDetectionFeelerLength / 2.0 * temp;

		// Feeler to right
		temp = m_pLH_Bot->Heading();
		Vec2DRotateAroundOrigin(temp, HalfPi * 0.5);
		m_Feelers[2] = m_pLH_Bot->Pos() + m_dWallDetectionFeelerLength / 2.0 * temp;
	}

	/*---------------------Separation-------------------------------------\
	| - This calculates a force repelling from the other neighbors.
	\--------------------------------------------------------------------*/
	Vector2D LH_Steering::Separation(const std::list<LH_Bot*>& neighbors)
	{
		//iterate through all the neighbors and calculate the vector from the
		Vector2D SteeringForce;

		std::list<LH_Bot*>::const_iterator it = neighbors.begin();
		for (it; it != neighbors.end(); ++it)
		{
			//make sure this agent isn't included in the calculations and that
			//the agent being examined is close enough. ***also make sure it doesn't
			//include the evade target ***
			if ((*it != m_pLH_Bot) && (*it)->IsTagged() &&
				(*it != m_pTargetAgent1))
			{
				Vector2D ToAgent = m_pLH_Bot->Pos() - (*it)->Pos();

				//scale the force inversely proportional to the agents distance  
				//from its neighbor.
				SteeringForce += Vec2DNormalize(ToAgent) / ToAgent.Length();
			}
		}

		return SteeringForce;
	}
}




///////////////////////////////////////////////////////////////////////////////////

/*---------------------Constants--------------------------------------\
\--------------------------------------------------------------------*/

// The radius of the constraining circle for the wander behavior
const double WanderRad    = 1.2;
// Distance the wander circle is projected in front of the agent
const double WanderDist   = 2.0;
// The maximum amount of displacement along the circle each frame
const double WanderJitterPerSec = 40.0;

/*---------------------Steering---------------------------------------\
\--------------------------------------------------------------------*/
class LH_Steering
{
public:
  
  enum summing_method{weighted_average, prioritized, dithered};

private:

  enum behavior_type
  {
    none               = 0x00000,
    seek               = 0x00002,
    arrive             = 0x00008,
    wander             = 0x00010,
    separation         = 0x00040,
    wall_avoidance     = 0x00200,
  };

private:

  
  // A pointer to the owner of this instance
  LH_Bot*     m_pLH_Bot; 
  
  // Pointer to the world data
  LH_Game*    m_pWorld;
  
  // The steering force created by the combined effect of all
  // the selected behaviors
  Vector2D       m_vSteeringForce;
 
  // These can be used to keep track of friends, pursuers, or prey
  LH_Bot*     m_pTargetAgent1;
  LH_Bot*     m_pTargetAgent2;

  // The current target
  Vector2D    m_vTarget;

  // A vertex buffer to contain the feelers rqd for wall avoidance  
  std::vector<Vector2D> m_Feelers;
  
  // The length of the 'feeler/s' used in wall detection
  double                 m_dWallDetectionFeelerLength;

  // The current position on the wander circle the agent is
  // attempting to steer towards
  Vector2D     m_vWanderTarget; 

  // Explained above
  double        m_dWanderJitter;
  double        m_dWanderRadius;
  double        m_dWanderDistance;

  // Multipliers. These can be adjusted to effect strength of the  
  // appropriate behavior.
  double        m_dWeightSeparation;
  double        m_dWeightWander;
  double        m_dWeightWallAvoidance;
  double        m_dWeightSeek;
  double        m_dWeightArrive;

  // How far the agent can 'see'
  double        m_dViewDistance;

  // Binary flags to indicate whether or not a behavior should be active
  int           m_iFlags;

  // Arrive makes use of these to determine how quickly a LH_Bot
  // should decelerate to its target
  enum Deceleration{slow = 3, normal = 2, fast = 1};

  // Default
  Deceleration m_Deceleration;

  // Is cell space partitioning to be used or not?
  bool          m_bCellSpaceOn;
 
  // What type of method is used to sum any active behavior
  summing_method  m_SummingMethod;

  // This function tests if a specific bit of m_iFlags is set
  bool      On(behavior_type bt){return (m_iFlags & bt) == bt;}

  bool      AccumulateForce(Vector2D &sf, Vector2D ForceToAdd);

  // Creates the antenna utilized by the wall avoidance behavior
  void      CreateFeelers();

   /*---------------------NOTES------------------------------------------\
   | - BEGIN BEHAVIOR DECELARATIONS
   \--------------------------------------------------------------------*/

  // This behavior moves the agent towards a target position
  Vector2D Seek(const Vector2D &target);

  // This behavior is similar to seek but it attempts to arrive 
  // at the target with a zero velocity
  Vector2D Arrive(const Vector2D    &target,
                  const Deceleration deceleration);

  // This behavior makes the agent wander about randomly
  Vector2D Wander();

  // This returns a steering force which will keep the agent away from any
  // walls it may encounter
  Vector2D WallAvoidance(const std::vector<Wall2D*> &walls);

  Vector2D Separation(const std::list<LH_Bot*> &agents);

  /*---------------------NOTES------------------------------------------\
  | - END BEHAVIOR DECELARATIONS
  \--------------------------------------------------------------------*/

  // Calculates and sums the steering forces from any active behaviors
  Vector2D CalculatePrioritized();
  
public:

  LH_Steering(LH_Game* world, LH_Bot* agent);

  virtual ~LH_Steering();

  // Calculates and sums the steering forces from any active behaviors
  Vector2D Calculate();

  // Calculates the component of the steering force that is parallel
  // with the LH_Bot heading
  double    ForwardComponent();

  // Calculates the component of the steering force that is perpendicuar
  // with the LH_Bot heading
  double    SideComponent();

  void      SetTarget(Vector2D t){m_vTarget = t;}
  Vector2D  Target()const{return m_vTarget;}

  void      SetTargetAgent1(LH_Bot* Agent){m_pTargetAgent1 = Agent;}
  void      SetTargetAgent2(LH_Bot* Agent){m_pTargetAgent2 = Agent;}

  Vector2D  Force()const{return m_vSteeringForce;}

  void      SetSummingMethod(summing_method sm){m_SummingMethod = sm;}

  void SeekOn(){m_iFlags |= seek;}
  void ArriveOn(){m_iFlags |= arrive;}
  void WanderOn(){m_iFlags |= wander;}
  void SeparationOn(){m_iFlags |= separation;}
  void WallAvoidanceOn(){m_iFlags |= wall_avoidance;}

  void SeekOff()  {if(On(seek))   m_iFlags ^=seek;}
  void ArriveOff(){if(On(arrive)) m_iFlags ^=arrive;}
  void WanderOff(){if(On(wander)) m_iFlags ^=wander;}
  void SeparationOff(){if(On(separation)) m_iFlags ^=separation;}
  void WallAvoidanceOff(){if(On(wall_avoidance)) m_iFlags ^=wall_avoidance;}

  bool SeekIsOn(){return On(seek);}
  bool ArriveIsOn(){return On(arrive);}
  bool WanderIsOn(){return On(wander);}
  bool SeparationIsOn(){return On(separation);}
  bool WallAvoidanceIsOn(){return On(wall_avoidance);}

  const std::vector<Vector2D>& GetFeelers()const{return m_Feelers;}
  
  double WanderJitter()const{return m_dWanderJitter;}
  double WanderDistance()const{return m_dWanderDistance;}
  double WanderRadius()const{return m_dWanderRadius;}

  double SeparationWeight()const{return m_dWeightSeparation;}
};