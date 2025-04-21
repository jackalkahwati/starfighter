// augmentPilot.js

// PD controller for Augmented-Pilot mode: auto-level roll and provide basic attitude corrections

// Configurable limits and gains
const MAX_ROLL = Math.PI / 2;      // ±90°
const Kp = 2.5, Kd = 1.2;            // PD gains for roll correction

// We store last roll for derivative calculation
let lastRoll = null;

// The augmentPilot function applies a PD controller to the ship's roll angle to bring it closer to zero
// It assumes that 'playerShip' is a global THREE.Group representing the player's ship
function augmentPilot(dt) {
    // Get current roll (rotation about Z axis)
    const currentRoll = playerShip.rotation.z;
    if (lastRoll === null) {
        lastRoll = currentRoll;
    }
    const rollRate = (currentRoll - lastRoll) / dt;
    lastRoll = currentRoll;
    
    // PD control torque to correct roll towards 0
    const correction = -Kp * currentRoll - Kd * rollRate;
    
    // Apply correction: Here we simply adjust the roll angle directly
    playerShip.rotation.z += correction * dt;
}

// Expose the function to the global scope
window.augmentPilot = augmentPilot; 