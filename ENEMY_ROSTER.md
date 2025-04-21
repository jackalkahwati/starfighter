### Revised Enemy Roster — **"Mini Gunstar Edition"**

| Class | 3‑D Model & Visual | Hit Box & Collision | Motion Pattern | Level(s) Appears |
|-------|-------------------|---------------------|----------------|------------------|
| **Ko‑Dan Fighter (“Mini Gunstar”)** | Low‑poly re‑creation of the angular Ko‑Dan assault craft. 12‑18 tris, textured in dull gun‑metal with red running lights. | **Oriented Bounding Box (OBB)** – 7 × 5 × 3 u in local space.<br>Collision test: `Separating Axis Theorem` once per frame, or an easier **capsule** of length 6 u, radius 2 u. | Spawns at X ±40, Y ±25, Z = ‑120. <br>**Jerk‑n‑juke** path: every 1.2 s picks a random lateral dodge (±6 u) while advancing on +Z at 24–35 u·s⁻¹ × level speed‑mult. | Levels 1 → 5 (baseline grunt) |
| **Forge Hauler** | Industrial orange torus *plus* cargo pods (4 small cubes parented around rim). Emits sparks. | Capsule radius 3 u, length 2 u. HP = 3. | Slower: 18 u·s⁻¹ × level‑mult. On death splits into **2 mini fighters** (scaled 0.6). | Level 4 onward |
| **Drone Swarm** | 8 tiny Gunstar drones (scale 0.4) grouped under a single parent. | Parent OBB of 10 × 8 u; each child has radius 1 u for hit tests. | Sine‑wave flock: parent oscillates `X = 12 sin(t*2)` while drifting at 30 u·s⁻¹. | Level 3+ |
| **Command Carrier (Boss)** | Cyan super‑torus hull with 4 shield nodes **+** dorsal Mini Gunstar turret that fires back. | Core capsule ( r 5 u, l 4 u ) + node capsules. Core invulnerable until nodes gone. | Advances slowly (15 u·s⁻¹), rotates 20°·s⁻¹ around Z, turret swivels to face player every frame. | Level 5 @ ≥ 9 000 pts |

---

### Updated Motion & AI Details

1. **Ko‑Dan Fighter (“Mini Gunstar”)**  
   ```js
   fighter.v.z = baseSpeed * levelSpeed;        // forward
   fighter.v.x += (Math.random()-0.5) * 12;     // lateral impulse every 1.2 s
   ```
   *Collision* – capsule vs bullet:  
   ```js
   if (capsuleDistance2(fighter.pos, fighter.axis, 2, bullet.pos) < 4) ...
   ```

2. **Forge Hauler** – identical to old forge ring except the child meshes are now `Mini Gunstars`.

3. **Drone Swarm** – parent object gets sine X‑motion; children inherit parent pos + radial offsets.

4. **Boss Carrier** – shield nodes remain small toruses, but a **turretGunstar** child rotates:  
   ```js
   turret.lookAt(player.position);
   if (time - lastShot > 1.2) fireEnemyBolt();
   ```

---

### Collision Helper (capsule vs point)

```js
function capsuleDistance2(A, B, radius, P) {
  // A,B = capsule segment ends; P = point
  const AB = B.clone().sub(A);
  const t  = MathUtils.clamp( P.clone().sub(A).dot(AB) / AB.lengthSq(), 0, 1 );
  const closest = A.clone().addScaledVector(AB, t);
  return closest.distanceToSquared(P) - radius*radius;
}
```

> *Use this instead of the old sphere test; still very cheap and accurate enough for oriented ships.*

---

### Visual Pay‑off

* Player immediately recognizes the iconic Ko‑Dan craft—pure fan service.  
* Turning torus → **industrial hauler** keeps split mechanic but feels lore‑authentic.  
* Boss now looks like a mini‑Gunstar dock embedded into a capital‑class shield ring.

Drop these definitions into your spawn logic and swap the old torus mesh for the GLTF or param `MiniGunstarGeometry`. All other game systems (HUD blips, level gating, Death Blossom, ASCII mode) stay unchanged. Let me know if you need the actual low‑poly Gunstar mesh or guidance on GLTF loading. 