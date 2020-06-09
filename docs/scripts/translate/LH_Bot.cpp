/*---------------------LH_Bot-----------------------------------------\
| - Class to implement the LH_Bot.
\--------------------------------------------------------------------*/

#include "LH_Bot.h"
#include "misc/Cgdi.h"
#include "misc/utils.h"
#include "2D/Transformations.h"
#include "2D/Geometry.h"
#include "lua/LH_Scriptor.h"
#include "LH_Game.h"
#include "navigation/LH_PathPlanner.h"
#include "LH_SteeringBehaviors.h"
#include "LH_UserOptions.h"
#include "time/Regulator.h"
#include "LH_WeaponSystem.h"
#include "LH_SensoryMemory.h"

#include "Messaging/Telegram.h"
#include "LH_Messages.h"
#include "Messaging/MessageDispatcher.h"

#include "goals/LH_Goal_Types.h"
#include "goals/Goal_Think.h"

#include "Inventory.h"

#include "Debug/DebugConsole.h"

/*---------------------Constructor------------------------------------\
\--------------------------------------------------------------------*/
LH_Bot::LH_Bot(LH_Game* world,Vector2D pos):

  MovingEntity(pos,
               script->GetDouble("Bot_Scale"),
               Vector2D(0,0),
               script->GetDouble("Bot_MaxSpeed"),
               Vector2D(1,0),
               script->GetDouble("Bot_Mass"),
               Vector2D(script->GetDouble("Bot_Scale"),script->GetDouble("Bot_Scale")),
               script->GetDouble("Bot_MaxHeadTurnRate"),
               script->GetDouble("Bot_MaxForce")),
                 // Attributes
                 m_iMaxHealth(script->GetInt("Bot_MaxHealth")),
                 m_iHealth(script->GetInt("Bot_MaxHealth")),
				 // AI and Control
                 m_pPathPlanner(NULL),
                 m_pSteering(NULL),
                 m_pWorld(world),
                 m_pBrain(NULL),
                 m_iNumUpdatesHitPersistant((int)(FrameRate * script->GetDouble("HitFlashTime"))),
                 m_bHit(false),
                 m_iScore(0),
                 m_Status(spawning),
                 m_bPossessed(false),
                 m_dFieldOfView(DegsToRads(script->GetDouble("Bot_FOV"))),
				 // Ammunition
				 m_iAmmo_LMG_Rounds_Left(0),
				 m_iAmmo_LMG_Mag_Size(60),
				 m_iAmmo_LMG_Max_Carried(240),
				 m_iAmmo_LMG_On_Hand(0)
           
{
  SetEntityType(type_bot);

  SetUpVertexBuffer();
  
  // A bot starts off facing in the direction it is heading
  m_vFacing = m_vHeading;

  // Create the navigation module
  m_pPathPlanner = new LH_PathPlanner(this);

  // Create the steering behavior class
  m_pSteering = new LH_Steering(world, this);

  // Create the Inventory class
  m_pInv = new Inventory(world, this);

  // Create the regulators
  m_pWeaponSelectionRegulator = new Regulator(script->GetDouble("Bot_WeaponSelectionFrequency"));
  m_pGoalArbitrationRegulator =  new Regulator(script->GetDouble("Bot_GoalAppraisalUpdateFreq"));
  m_pTargetSelectionRegulator = new Regulator(script->GetDouble("Bot_TargetingUpdateFreq"));
  m_pTriggerTestRegulator = new Regulator(script->GetDouble("Bot_TriggerUpdateFreq"));
  m_pVisionUpdateRegulator = new Regulator(script->GetDouble("Bot_VisionUpdateFreq"));

  // Create the goal queue
  m_pBrain = new Goal_Think(this);

  // Create the targeting system
  m_pTargSys = new LH_TargetingSystem(this);

  m_pWeaponSys = new LH_WeaponSystem(this,
                                        script->GetDouble("Bot_ReactionTime"),
                                        script->GetDouble("Bot_AimAccuracy"),
                                        script->GetDouble("Bot_AimPersistance"));

  m_pSensoryMem = new LH_SensoryMemory(this, script->GetDouble("Bot_MemorySpan"));

  // Client Window Initialization
  GetClientRect(m_pWorld->GetHWND(), &m_pWorld->GetRECT());

  m_icxClient = m_pWorld->GetRECT().right;
  m_icyClient = m_pWorld->GetRECT().bottom;
  m_iClientLeft = m_pWorld->GetRECT().left;
  m_iClientRight = m_icxClient;
  m_iClientTop = m_pWorld->GetRECT().top;
  m_iClientBottom = m_icyClient;

  m_iwidth = m_pWorld->GetRECT().right - m_pWorld->GetRECT().left;
  m_iheight = m_pWorld->GetRECT().bottom - m_pWorld->GetRECT().top;
}

/*---------------------Deconstructor----------------------------------\
\--------------------------------------------------------------------*/
LH_Bot::~LH_Bot()
{
  debug_con << "deleting LH bot (id = " << ID() << ")" << "";
  
  delete m_pBrain;
  delete m_pPathPlanner;
  delete m_pSteering;
  delete m_pWeaponSelectionRegulator;
  delete m_pTargSys;
  delete m_pGoalArbitrationRegulator;
  delete m_pTargetSelectionRegulator;
  delete m_pTriggerTestRegulator;
  delete m_pVisionUpdateRegulator;
  delete m_pWeaponSys;
  delete m_pSensoryMem;
}

/*---------------------AddToInv---------------------------------------\
| - Add an item to this bot's inventory
\--------------------------------------------------------------------*/
/*void LH_Bot::AddToInv(int id)
{
	
}/*

/*---------------------Spawn------------------------------------------\
| - Spawns the bot at the given position
\--------------------------------------------------------------------*/
void LH_Bot::Spawn(Vector2D pos)
{
    SetAlive();
    m_pBrain->RemoveAllSubgoals();
    m_pTargSys->ClearTarget();
    SetPos(pos);
    m_pWeaponSys->Initialize();
    RestoreHealthToMaximum();
}

/*---------------------Update-----------------------------------------\
\--------------------------------------------------------------------*/
void LH_Bot::Update()
{
  // Process the currently active goal. Note this is required even if the bot
  // is under user control. This is because a goal is created whenever a user 
  // clicks on an area of the map that necessitates a path planning request.
  m_pBrain->Process();
  
  // Calculate the steering force and update the bot's velocity and position
  UpdateMovement();

  // If the bot is under AI control but not scripted
  if (!isPossessed())
  {           
    // Examine all the opponents in the bots sensory memory and select one
    // to be the current target
    if (m_pTargetSelectionRegulator->isReady())
    {      
      m_pTargSys->Update();
    }

    // Appraise and arbitrate between all possible high level goals
    if (m_pGoalArbitrationRegulator->isReady())
    {
       m_pBrain->Arbitrate(); 
    }

    // Update the sensory memory with any visual stimulus
    if (m_pVisionUpdateRegulator->isReady())
    {
      m_pSensoryMem->UpdateVision();
    }
  
    // Select the appropriate weapon to use from the weapons currently in
    // the inventory
    if (m_pWeaponSelectionRegulator->isReady())
    {       
      m_pWeaponSys->SelectWeapon();       
    }

    // This method aims the bot's current weapon at the current target
    // and takes a shot if a shot is possible
    m_pWeaponSys->TakeAimAndShoot();
  }
}

/*---------------------UpdateMovement---------------------------------\
| - This method is called from the update method. It calculates and
|   applies the steering force for this time-step.
\--------------------------------------------------------------------*/
void LH_Bot::UpdateMovement()
{
  // Calculate the combined steering force
  Vector2D force = m_pSteering->Calculate();

  // If no steering force is produced decelerate the player by applying a
  // braking force
  if (m_pSteering->Force().isZero())
  {
    const double BrakingRate = 0.8; 

    m_vVelocity = m_vVelocity * BrakingRate;                                     
  }

  // Calculate the acceleration
  Vector2D accel = force / m_dMass;

  // Update the velocity
  m_vVelocity += accel;

  // Ensure vehicle does not exceed maximum velocity
  m_vVelocity.Truncate(m_dMaxSpeed);

  // Update the position
  m_vPosition += m_vVelocity;

  // If the vehicle has a non zero velocity the heading and side vectors must 
  // be updated
  if (!m_vVelocity.isZero())
  {    
    m_vHeading = Vec2DNormalize(m_vVelocity);

    m_vSide = m_vHeading.Perp();
  }
}

/*---------------------isReadyForTriggerUpdate------------------------\
| - Returns true if the bot is ready to be tested against the world
|   triggers.
\--------------------------------------------------------------------*/
bool LH_Bot::isReadyForTriggerUpdate()const
{
  return m_pTriggerTestRegulator->isReady();
}

/*---------------------HandleMessage----------------------------------\
\--------------------------------------------------------------------*/
bool LH_Bot::HandleMessage(const Telegram& msg)
{
  // First see if the current goal accepts the message
  if (GetBrain()->HandleMessage(msg)) return true;
 
  // Handle any messages not handles by the goals
  switch(msg.Msg)
  {
  case Msg_TakeThatMF:

    // Just return if already dead or spawning
    if (isDead() || isSpawning()) return true;

    // The extra info field of the telegram carries the amount of damage
    ReduceHealth(DereferenceToType<int>(msg.ExtraInfo));

    // If this bot is now dead let the shooter know
    if (isDead())
    {
      Dispatcher->DispatchMsg(SEND_MSG_IMMEDIATELY,
                              ID(),
                              msg.Sender,
                              Msg_YouGotMeYouSOB,
                              NO_ADDITIONAL_INFO);
    }

    return true;

  case Msg_YouGotMeYouSOB:
    
    IncrementScore();
    
    // The bot this bot has just killed should be removed as the target
    m_pTargSys->ClearTarget();

    return true;

  case Msg_GunshotSound:

    // Add the source of this sound to the bot's percepts
    GetSensoryMem()->UpdateWithSoundSource((LH_Bot*)msg.ExtraInfo);

    return true;

  case Msg_UserHasRemovedBot:
    {

      LH_Bot* pRemovedBot = (LH_Bot*)msg.ExtraInfo;

      GetSensoryMem()->RemoveBotFromMemory(pRemovedBot);

      // If the removed bot is the target, make sure the target is cleared
      if (pRemovedBot == GetTargetSys()->GetTarget())
      {
        GetTargetSys()->ClearTarget();
      }

      return true;
    }


  default: return false;
  }
}

/*---------------------RotateFacingTowardPosition---------------------\
| - Given a target position, this method rotates the bot's facing 
|   vector by an amount not greater than m_dMaxTurnRate until it
|   directly faces the target.
| - Returns true when the heading is facing in the desired direction.
\--------------------------------------------------------------------*/
bool LH_Bot::RotateFacingTowardPosition(Vector2D target)
{
  Vector2D toTarget = Vec2DNormalize(target - m_vPosition);

  double dot = m_vFacing.Dot(toTarget);

  // Clamp to rectify any rounding errors
  Clamp(dot, -1, 1);

  // Determine the angle between the heading vector and the target
  double angle = acos(dot);

  // Return true if the bot's facing is within WeaponAimTolerance degs of
  // facing the target
  const double WeaponAimTolerance = 0.01; // 2 degs approx

  if (angle < WeaponAimTolerance)
  {
    m_vFacing = toTarget;
    return true;
  }

  // Clamp the amount to turn to the max turn rate
  if (angle > m_dMaxTurnRate) angle = m_dMaxTurnRate;
  
  // The next few lines use a rotation matrix to rotate the player's facing
  // vector accordingly
  C2DMatrix RotationMatrix;
  
  // Notice how the direction of rotation has to be determined when creating
  // the rotation matrix
  RotationMatrix.Rotate(angle * m_vFacing.Sign(toTarget));	
  RotationMatrix.TransformVector2Ds(m_vFacing);

  return false;
}

/*---------------------ReduceHealth-----------------------------------\
\--------------------------------------------------------------------*/
void LH_Bot::ReduceHealth(unsigned int val)
{
  m_iHealth -= val;

  if (m_iHealth <= 0)
  {
    SetDead();
  }

  m_bHit = true;

  m_iNumUpdatesHitPersistant = (int)(FrameRate * script->GetDouble("HitFlashTime"));
}

/*---------------------TakePossession---------------------------------\
| - This is called to allow a human player to control the bot.
\--------------------------------------------------------------------*/
void LH_Bot::TakePossession()
{
  if ( !(isSpawning() || isDead()))
  {
    m_bPossessed = true;

    debug_con << "Player Possesses bot " << this->ID() << "";
  }
}

/*---------------------Exorcise---------------------------------------\
| - Called when a human is exorcised from this bot and the AI takes
|   control.
\--------------------------------------------------------------------*/
void LH_Bot::Exorcise()
{
  m_bPossessed = false;

  // When the player is exorcised then the bot should resume normal service
  m_pBrain->AddGoal_Explore();
  
  debug_con << "Player is exorcised from bot " << this->ID() << "";
}

/*---------------------ChangeWeapon-----------------------------------\
\--------------------------------------------------------------------*/
void LH_Bot::ChangeWeapon(unsigned int type)
{
  m_pWeaponSys->ChangeWeapon(type);
}

/*---------------------FireWeapon-------------------------------------\
| - Fires the current weapon at the given position.
\--------------------------------------------------------------------*/
void LH_Bot::FireWeapon(Vector2D pos)
{
  m_pWeaponSys->ShootAt(pos);
}

/*---------------------CalculateTimeToReachPosition-------------------\
| - Returns a value indicating the time in seconds it will take the bot
|   to reach the given position at its current speed.
\--------------------------------------------------------------------*/
double LH_Bot::CalculateTimeToReachPosition(Vector2D pos)const
{
  return Vec2DDistance(Pos(), pos) / (MaxSpeed() * FrameRate);
}

/*---------------------isAtPosition-----------------------------------\
| - Returns true if the bot is close to the given position.
\--------------------------------------------------------------------*/
bool LH_Bot::isAtPosition(Vector2D pos)const
{
  const static double tolerance = 10.0;
  
  return Vec2DDistanceSq(Pos(), pos) < tolerance * tolerance;
}

/*---------------------hasLOSto---------------------------------------\
| - Returns true if the bot has line of sight to the given position.
\--------------------------------------------------------------------*/
bool LH_Bot::hasLOSto(Vector2D pos)const
{
  return m_pWorld->isLOSOkay(Pos(), pos);
}

/*---------------------canWalkTo--------------------------------------\
| - Returns true if this bot can move directly to the given position
|   without bumping into any walls.
\--------------------------------------------------------------------*/
bool LH_Bot::canWalkTo(Vector2D pos)const
{
  return !m_pWorld->isPathObstructed(Pos(), pos, BRadius());
}

/*---------------------canWalkBetween---------------------------------\
| - Similar to above, returns true if the bot can move between the two
|   given positions without bumping into any walls.
\--------------------------------------------------------------------*/
bool LH_Bot::canWalkBetween(Vector2D from, Vector2D to)const
{
 return !m_pWorld->isPathObstructed(from, to, BRadius());
}

/*---------------------canStep Methods--------------------------------\
| - Returns true if there is space enough to step in the indicated
|   direction. If true, PositionOfStep will be assigned the offset
|   position.
\--------------------------------------------------------------------*/
bool LH_Bot::canStepLeft(Vector2D& PositionOfStep)const
{
  static const double StepDistance = BRadius() * 2;

  PositionOfStep = Pos() - Facing().Perp() * StepDistance - Facing().Perp() * BRadius();

  return canWalkTo(PositionOfStep);
}

bool LH_Bot::canStepRight(Vector2D& PositionOfStep)const
{
  static const double StepDistance = BRadius() * 2;

  PositionOfStep = Pos() + Facing().Perp() * StepDistance + Facing().Perp() * BRadius();

  return canWalkTo(PositionOfStep);
}

bool LH_Bot::canStepForward(Vector2D& PositionOfStep)const
{
  static const double StepDistance = BRadius() * 2;

  PositionOfStep = Pos() + Facing() * StepDistance + Facing() * BRadius();

  return canWalkTo(PositionOfStep);
}

bool LH_Bot::canStepBackward(Vector2D& PositionOfStep)const
{
  static const double StepDistance = BRadius() * 2;

  PositionOfStep = Pos() - Facing() * StepDistance - Facing() * BRadius();

  return canWalkTo(PositionOfStep);
}

/*---------------------Render-----------------------------------------\
\--------------------------------------------------------------------*/
void LH_Bot::Render()                                         
{
  // When a bot is hit by a projectile this value is set to a constant user
  // defined value which dictates how long the bot should have a thick red
  // circle drawn around it (to indicate it's been hit) The circle is drawn
  // as long as this value is positive. (see Render)
  m_iNumUpdatesHitPersistant--;

  if (isDead() || isSpawning()) return;
  
  gdi->BluePen();
  
  m_vecBotVBTrans = WorldTransform(m_vecBotVB,
                                   Pos(),
                                   Facing(),
                                   Facing().Perp(),
                                   Scale());

  gdi->ClosedShape(m_vecBotVBTrans);
  
  // Draw the head
  gdi->BrownBrush();
  gdi->Circle(Pos(), 6.0 * Scale().x);

  // Render the bot's weapon
  m_pWeaponSys->RenderCurrentWeapon();

  // Render a thick red circle if the bot gets hit by a weapon
  if (m_bHit)
  {
    gdi->ThickRedPen();
    gdi->HollowBrush();
    gdi->Circle(m_vPosition, BRadius()+1);

    if (m_iNumUpdatesHitPersistant <= 0)
    {
      m_bHit = false;
    }
  }

  gdi->TransparentText();
  gdi->TextColor(0,255,0);

  if (UserOptions->m_bShowBotIDs)
  {
    gdi->TextAtPos(Pos().x -10, Pos().y-20, ttos(ID()));
  }

  if (UserOptions->m_bShowBotHealth)
  {
    gdi->TextAtPos(Pos().x-40, Pos().y-5, "H:"+ ttos(Health()));
  }

  if (UserOptions->m_bShowScore)
  {
    gdi->TextAtPos(Pos().x-40, Pos().y+10, "Scr:"+ ttos(Score()));
  }    
}

/*---------------------SetUpVertexBuffer------------------------------\
\--------------------------------------------------------------------*/
void LH_Bot::SetUpVertexBuffer()
{
  // Setup the vertex buffers and calculate the bounding radius
  const int NumBotVerts = 4;
  const Vector2D bot[NumBotVerts] = {Vector2D(-3, 8),
                                     Vector2D(3,10),
                                     Vector2D(3,-10),
                                     Vector2D(-3,-8)};

  m_dBoundingRadius = 0.0;
  double scale = script->GetDouble("Bot_Scale");
  
  for (int vtx=0; vtx<NumBotVerts; ++vtx)
  {
    m_vecBotVB.push_back(bot[vtx]);

    // Set the bounding radius to the length of the 
    // greatest extent
    if (abs(bot[vtx].x)*scale > m_dBoundingRadius)
    {
      m_dBoundingRadius = abs(bot[vtx].x*scale);
    }

    if (abs(bot[vtx].y)*scale > m_dBoundingRadius)
    {
      m_dBoundingRadius = abs(bot[vtx].y)*scale;
    }
  }
}

void LH_Bot::RestoreHealthToMaximum(){m_iHealth = m_iMaxHealth;}

void LH_Bot::IncreaseHealth(unsigned int val)
{
  m_iHealth+=val; 
  Clamp(m_iHealth, 0, m_iMaxHealth);
}

void LH_Bot::RenderGUI()
{
	double rounds = 0;
	double maxrounds = 0;

	int tempLeft = m_iClientLeft;
	int tempRight = m_iClientRight;
	int tempTop = m_iClientBottom - 40;
	int tempBottom = m_iClientBottom;

	unsigned int weapType;
	
	if (GetNameOfType(GetInventory()->GetEquipped("MHand")->GetEquipItem()->EntityType()) != "empty")
	{
		weapType = GetInventory()->GetEquipped("MHand")->GetEquipItem()->EntityType();
		switch (weapType)
		{
		case lmg:
		{
			rounds = GetInventory()->GetLMG_RoundsLeft();
			maxrounds = GetInventory()->GetLMG_OnHand();
		}break;
		default:
			break;
		}
	}

	// GUI Window
	gdi->ThickBlackPen();
	gdi->GreyBrush();
	gdi->Rect(tempLeft, tempTop, tempRight, tempBottom);

	// Health Points
	gdi->BlackPen();
	gdi->HollowBrush();
	gdi->Rect((tempLeft + 10), (tempTop + 25), (tempLeft + 110), (tempTop + 35));
	gdi->TextColor(255, 0, 25);
	gdi->TextAtPos((tempLeft + 50), (tempTop + 10), "HP");
	gdi->RedBrush();
	gdi->Rect((tempLeft + 10), (tempTop + 25), (tempLeft + 110), (tempTop + 35));

	// Energy Points
	gdi->BlackPen();
	gdi->HollowBrush();
	gdi->Rect((tempLeft + 130), (tempTop + 25), (tempLeft + 230), (tempTop + 35));
	gdi->TextColor(0, 68, 255);
	gdi->TextAtPos((tempLeft + 170), (tempTop + 10), "MP");
	gdi->BlueBrush();
	gdi->Rect((tempLeft + 130), (tempTop + 25), (tempLeft + 230), (tempTop + 35));
	
	// Stamina Points
	gdi->BlackPen();
	gdi->HollowBrush();
	gdi->Rect((tempLeft + 250), (tempTop + 25), (tempLeft + 350), (tempTop + 35));
	gdi->TextColor(234, 255, 0);
	gdi->TextAtPos((tempLeft + 290), (tempTop + 10), "SP");
	gdi->YellowBrush();
	gdi->Rect((tempLeft + 250), (tempTop + 25), (tempLeft + 350), (tempTop + 35));

	// Ammo
	gdi->RedPen();
	gdi->BlackBrush();
	gdi->Rect((tempRight - 100), (tempTop + 15), (tempRight - 10), (tempBottom - 5));
	gdi->TextColor(56, 242, 10);
	gdi->TextAtPos((tempRight - 90), (tempTop + 17), ttos(rounds));
	gdi->TextAtPos((tempRight - 55), (tempTop + 17), "/");
	gdi->TextAtPos((tempRight - 45), (tempTop + 17), ttos(maxrounds));
}