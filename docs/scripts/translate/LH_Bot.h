#ifndef LH_BOT_H
#define LH_BOT_H
#pragma warning (disable:4786)

/*---------------------LH_Bot-----------------------------------------\
| - Class to implement the LH_Bot.
\--------------------------------------------------------------------*/

#include <vector>
#include <iosfwd>
#include <vector>
#include <map>

#include "game/MovingEntity.h"
#include "misc/utils.h"
#include "LH_TargetingSystem.h"

// #include "Inventory.h"

class LH_PathPlanner;
class LH_Steering;
class LH_Game;
class Regulator;
class LH_Weapon;
struct Telegram;
class LH_Bot;
class Goal_Think;
class LH_WeaponSystem;
class LH_SensoryMemory;
class Inventory;

class LH_Bot : public MovingEntity
{
private:

  enum Status{alive, dead, spawning};

private:

	// Pointer to inventory
	Inventory* m_pInv;

  // Alive, dead or spawning?
  Status                             m_Status;

  // A pointer to the world data
  LH_Game*                        m_pWorld;

  // This object handles the arbitration and processing of high level goals
  Goal_Think*                        m_pBrain;

  // This is a class that acts as the bots sensory memory. Whenever this
  // bot sees or hears an opponent, a record of the event is updated in the 
  // memory.
  LH_SensoryMemory*               m_pSensoryMem;

  // The bot uses this object to steer
  LH_Steering*                    m_pSteering;

  // The bot uses this to plan paths
  LH_PathPlanner*                 m_pPathPlanner;

  // This is responsible for choosing the bot's current target
  LH_TargetingSystem*             m_pTargSys;

  // This handles all the weapons. and has methods for aiming, selecting and
  // shooting them
  LH_WeaponSystem*                m_pWeaponSys;

  // A regulator object limits the update frequency of a specific AI component
  Regulator*                         m_pWeaponSelectionRegulator;
  Regulator*                         m_pGoalArbitrationRegulator;
  Regulator*                         m_pTargetSelectionRegulator;
  Regulator*                         m_pTriggerTestRegulator;
  Regulator*                         m_pVisionUpdateRegulator;

  // The bot's health. Every time the bot is shot this value is decreased. If
  //it reaches zero then the bot dies (and respawns)
  int                                m_iHealth;
  
  // The bot's maximum health value. It starts its life with health at this value
  int                                m_iMaxHealth;

  // Each time this bot kills another this value is incremented
  int                                m_iScore;
  
  // The direction the bot is facing (and therefore the direction of aim). 
  // Note that this may not be the same as the bot's heading, which always
  // points in the direction of the bot's movement
  Vector2D                           m_vFacing;

  // A bot only perceives other bots within this field of view
  double                             m_dFieldOfView;
  
  // To show that a player has been hit it is surrounded by a thick 
  // red circle for a fraction of a second. This variable represents
  // the number of update-steps the circle gets drawn
  int                                m_iNumUpdatesHitPersistant;

  // Set to true when the bot is hit, and remains true until 
  // m_iNumUpdatesHitPersistant becomes zero. (used by the render method to
  // draw a thick red circle around a bot to indicate it's been hit)
  bool                               m_bHit;

  // Set to true when a human player takes over control of the bot
  bool                               m_bPossessed;

  // A vertex buffer containing the bot's geometry
  std::vector<Vector2D>              m_vecBotVB;
  // The buffer for the transformed vertices
  std::vector<Vector2D>              m_vecBotVBTrans;

  // Bots shouldn't be copied, only created or respawned
  LH_Bot(const LH_Bot&);
  LH_Bot& operator=(const LH_Bot&);

  // This method is called from the update method. It calculates and applies
  // the steering force for this time-step.
  void          UpdateMovement();

  // Initializes the bot's VB with its geometry
  void          SetUpVertexBuffer();

  // Ammunition
  unsigned int m_iAmmo_LMG_Rounds_Left;
  unsigned int m_iAmmo_LMG_Mag_Size;
  unsigned int m_iAmmo_LMG_Max_Carried;
  unsigned int m_iAmmo_LMG_On_Hand;

  // Client Window Stuff
  int m_icxClient;
  int m_icyClient;
  int m_iClientLeft;
  int m_iClientTop;
  int m_iClientRight;
  int m_iClientBottom;
  int m_iheight;
  int m_iwidth;

public:
  
  LH_Bot(LH_Game* world, Vector2D pos);
  virtual ~LH_Bot();

  // The usual suspects
  void         Render();
  void RenderGUI();
  void         Update();
  bool         HandleMessage(const Telegram& msg);
  void         Write(std::ostream&  os)const{/*not implemented*/}
  void         Read (std::ifstream& is){/*not implemented*/}

  // Handling the Inventory
  Inventory* GetInventory(){ return m_pInv; }
  
  // This rotates the bot's heading until it is facing directly at the target
  // position. Returns false if not facing at the target.
  bool          RotateFacingTowardPosition(Vector2D target);
 
  // Methods for accessing attribute data
  int           Health()const{return m_iHealth;}
  int           MaxHealth()const{return m_iMaxHealth;}
  void          ReduceHealth(unsigned int val);
  void          IncreaseHealth(unsigned int val);
  void          RestoreHealthToMaximum();

  int           Score()const{return m_iScore;}
  void          IncrementScore(){++m_iScore;}

  Vector2D      Facing()const{return m_vFacing;}
  double        FieldOfView()const{return m_dFieldOfView;}

  bool          isPossessed()const{return m_bPossessed;}
  bool          isDead()const{return m_Status == dead;}
  bool          isAlive()const{return m_Status == alive;}
  bool          isSpawning()const{return m_Status == spawning;}
  
  void          SetSpawning(){m_Status = spawning;}
  void          SetDead(){ m_Status = dead; }
  void          SetAlive(){m_Status = alive;}

  // Roll drops
  //LH_Game& Rollz(){ m_rWorld.RollDrops(); }

  // Returns a value indicating the time in seconds it will take the bot
  // to reach the given position at its current speed.
  double        CalculateTimeToReachPosition(Vector2D pos)const; 

  // Returns true if the bot is close to the given position
  bool          isAtPosition(Vector2D pos)const;

  // Interface for human player
  void          FireWeapon(Vector2D pos);
  void          ChangeWeapon(unsigned int type);
  void          TakePossession();
  void          Exorcise();

  // Spawns the bot at the given position
  void          Spawn(Vector2D pos);
  
  // Returns true if this bot is ready to test against all triggers
  bool          isReadyForTriggerUpdate()const;

  // Returns true if the bot has line of sight to the given position.
  bool          hasLOSto(Vector2D pos)const;

  // Returns true if this bot can move directly to the given position
  // without bumping into any walls
  bool          canWalkTo(Vector2D pos)const;

  // Similar to above. Returns true if the bot can move between the two
  // given positions without bumping into any walls
  bool          canWalkBetween(Vector2D from, Vector2D to)const;

  // Returns true if there is space enough to step in the indicated direction
  // If true PositionOfStep will be assigned the offset position
  bool          canStepLeft(Vector2D& PositionOfStep)const;
  bool          canStepRight(Vector2D& PositionOfStep)const;
  bool          canStepForward(Vector2D& PositionOfStep)const;
  bool          canStepBackward(Vector2D& PositionOfStep)const;

  LH_Game* const                  GetWorld(){return m_pWorld;} 
  LH_Steering* const              GetSteering(){return m_pSteering;}
  LH_PathPlanner* const           GetPathPlanner(){return m_pPathPlanner;}
  Goal_Think* const                  GetBrain(){return m_pBrain;}
  const LH_TargetingSystem* const GetTargetSys()const{return m_pTargSys;}
  LH_TargetingSystem* const       GetTargetSys(){return m_pTargSys;}
  LH_Bot* const                   GetTargetBot()const{return m_pTargSys->GetTarget();}
  LH_WeaponSystem* const          GetWeaponSys()const{return m_pWeaponSys;}
  LH_SensoryMemory* const         GetSensoryMem()const{return m_pSensoryMem;}
};

#endif