# Starfighter Synthwave — Frontier Rising (v3.0)

A 3D space shooter game built with Three.js featuring a synthwave aesthetic, multiple enemy types, and a 5-level progression system.

## Play the Game

Open `index.html` in your browser to play. Click anywhere to start the background music.

## Controls

- **Arrow Keys**: Move your ship
- **Space**: Shoot lasers
- **D**: Activate Death Blossom special attack (clears all enemies with a 15-second cooldown)
- **A**: Toggle ASCII rendering mode (retro dot-matrix visual style)
- **Goal**: Progress through 5 levels and defeat the final boss

## Features

- Complete 5-level arcade narrative with increasing difficulty
- Multiple enemy types (drones, forges, boss with shield nodes)
- Death Blossom special attack with visual effects
- Advanced radar HUD showing enemy positions
- Synthwave audio with background music and sound effects
- Visual explosions and particle effects
- Level notifications and game status banners
- Boss fight with shield nodes in the final level
- ASCII rendering mode that converts 3D graphics to colored text characters

## Technical Details

The game uses:
- Three.js for 3D rendering
- Howler.js for audio management
- Canvas API for HUD elements
- Dynamic difficulty scaling
- Responsive design that adapts to window size
- Custom ASCII rendering pass using WebGLRenderTarget

---

### Turning Starfighter into an **"Asteroid-Orbiter"**  
*(your ship circles a lumpy rock instead of a smooth planet)*  

---

## 1 · Why an asteroid is harder than Earth

| Earth-style orbit (point-mass)       | "Bumpy" asteroid                             |
|--------------------------------------|----------------------------------------------|
| Gravity ≈ \( \mu / r^2 \) from a single center \(\mu\). | Gravity changes with every ridge and crater. |
| Orbital plane stays fixed (without J2). | You get wild precession; a close pass can even **bounce** you into a different plane. |
| Equations are analytic.              | Must integrate a **polyhedron gravity model** or low-order spherical-harmonics in real time. |

---

## 2 · Fast but believable gravity model

### 2.1 Low-order spherical harmonics  
Treat the asteroid like a "potato" with its three biggest bumps baked into \( J₂,\, C₂₂,\, S₂₂ \).

\[
\mathbf g(\mathbf r) = -\frac{\mu}{r^3}\mathbf r \;\;+\;\
\frac{3\mu R^2}{2 r^5}\,\Big[\
J_{2} \Big( \mathbf r -5\frac{z^2}{r^2}\mathbf r \Big)
+ C_{22}\,\big(\dots\big) + S_{22}\,\big(\dots\big)
\Big]
\]

* **Pros:** only a few multiplies per frame.  
* **Cons:** looks wrong if you skim 100 m over a sharp ridge.

### 2.2 Polyhedron method (preferred for demo)
1. Model the asteroid as a convex mesh of ~400 triangles.  
2. Werner & Scheeres (1997) formula gives exact gravitational potential for each face/edge in \( \mathcal O(N_{\text{faces}}) \).  
3. Pre-compute face normals & edge coefficients → 1,000 – 2,000 √ operations per frame—fine in JS/WebGL for < 200 objects.

> **Three-line summary code**

```js
function gravityPolyhedron(P){         // P = position vec3 in m
  let acc = new THREE.Vector3();
  for(const f of faces){               // pre-baked arrays
    const r0 = P.clone().sub(f.v0);    // vector to face vertex
    const solid = f.normal.dot(r0) / ( // solid angle Ω_face
       Math.abs(r0.length()*f.distToPlane));
    acc.addScaledVector(f.normal, solid);
  }
  acc.multiplyScalar(-G * rho);        // ρ = density
  return acc;
}
```

---

## 3 · Gameplay translation

| Feature           | How it feels in cockpit                                                                 |
|-------------------|-----------------------------------------------------------------------------------------|
| **Low-alt pass**  | You have to thrust *constantly* to avoid being sucked into a crater.                    |
| **Station-keeping** | Pitch/yaw now counter unpredictable drift—great use for your new 6-DoF controls.         |
| **Debris wave**   | Destroyed "forge" shards fall along separate ballistic arcs—we use the same gravity call. |
| **Lock-on cone**  | Still works; missile seeker just Navs to target position each frame with new gravity vector. |

HUD tip: replace "UP/DOWN grid" with a pastel-purple *horizon ribbon* wrapped around the asteroid to show altitude visually.

---

## 4 · Implementation path (≈3 days)

| Day     | Task                                                                                     | Asset / code                                             |
|---------|------------------------------------------------------------------------------------------|----------------------------------------------------------|
| **D-3** | Obtain asteroid mesh (e.g. Itokawa GLTF 2 MB). Simplify to ≤ 400 faces.                   | NASA PDS → `meshoptimizer`.                              |
| **D-2** | Port polyhedron gravity to JS. Cache face constants.                                     | Use `faceNormals`, `edgeDirs` arrays; verify accel vs. GM/ r² at 1 km alt within 2 %. |
| **D-1** | Plug into player & enemy physics: `vel += g*dt`. Add horizon ribbon on HUD.               | Expect stable 60 FPS on M1 MBP.                          |

---

## 5 · Performance safety net

* If FPS < 50, down-sample: compute gravity every other frame, interpolate.  
* Keep far background (mountains, grid) **static skybox**—only near-field objects need the fancy gravity.

---

## 6 · Benefit for Space Force pitch

* Shows you can model *irregular bodies*—relevant to cislunar ops & asteroid defense.  
* Fancier than most SSA demos (they usually assume point mass).  
* Still looks like the synthwave screenshot you posted—branding is intact.

---

### Ready to merge?

If you'd like the full polyhedron code and a sample Itokawa mesh dropped into the canvas, just give me the word—I'll push a single file (`asteroidGravity.js`) plus instructions on calling it from your `animate()` loop.

Enjoy the game! 