// JavaScript Document

/*---------------------MovingEntity-----------------------------------\
| - Base class that defines entities that move. The entity has a local
|   coordinate system and members for defining its mass and velocity
\--------------------------------------------------------------------*/

class movingEntity extends baseGameEntity {
    constructor() {
        
    }
    
    /*---------------------RotateHeadingToFacePosition--------------------\
    | - Given a target position, rotate the entity's heading and side
    |   vectors by an amount not greater than m_dMaxTurnRate until it
    |   directly faces the target.
    | - Returns true when the heading is facing in the desired direction
    \--------------------------------------------------------------------*/
    rotateHeadingToFacePosition(target) {
        var toTarget = vec2DNormalize(target - this.position);
        
        var dot = this.heading.dot(toTarget);
        
        // Clamp the dot product, forcing it to remain valid for acos
        clamp(dot, -1, 1);
        
        // Find the angle between the heading vector and the target
        var angle = Math.acos(dot);
        
        // Return true if the entity is facing the target
        if (angle < 0.00001) return true;
        
        // Clamp the amount to turn to the max turn rate
        if (angle > this.maxTurnRate) angle = this.maxTurnRate;
        
        // Use a rotation matrix to rotate the entity's heading vector
        var rotationMatrix = new c2DMatrix();
        
        // Determine the direction of the rotation when creating the matrix
        rotationMatrix.rotate(angle * this.heading.sign(toTarget));
        rotationMatrix.transformVector2Ds(this.heading);
        rotationMatrix.transformVector2Ds(this.velocity);
        
        // Recreate the side vector
        this.side = this.heading.perp();
        
        // Return false since the rotation is not complete yet
        return false;
    }
    
    /*---------------------SetHeading-------------------------------------\
    | - Initially checks if the given heading is not a vector of zero
    |   length. If the heading is valid, sets the entity's heading and side
    |   vectors accordingly.
    \--------------------------------------------------------------------*/
    setHeading(newHeading) {
        assert( ((newHeading.lengthSq() - 1.0) < 0.00001), `<MovingEntity:SetHeading:Error> HeadingSq not smaller than zero: ${newHeading.lengthSq() - 1.0}`);
        
        this.heading = newHeading;
        
        // The side vector must always be perpendicular to the heading
        this.side = this.heading.perp();
    }
}