// Enemy factory module with simple Enemy class
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';

const { Group, Mesh, TorusGeometry, MeshStandardMaterial, BoxGeometry,
        ConeGeometry, Shape, ExtrudeGeometry } = THREE;

export class Enemy extends THREE.Object3D {
    constructor(mesh, hp = 1, scoreValue = 100, type = 'enemy') {
        super();
        this.userData = { type, hp, scoreValue };
        this.add(mesh);
        this.mesh = mesh;
        this.hp = hp;
        this.scoreValue = scoreValue;
        this.type = type;
    }
}

export function createMiniGunstar() {
    const shape = new Shape();
    const h = 1.0;
    const w = 0.6;
    shape.moveTo(0, h / 2);
    shape.lineTo(-w / 2, -h / 2);
    shape.lineTo(w / 2, -h / 2);
    shape.lineTo(0, h / 2);

    const extrudeSettings = { depth: 0.4, bevelEnabled: false };
    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.rotateX(Math.PI / 2);

    const material = new MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 0.5,
        metalness: 0.3,
        roughness: 0.6,
        flatShading: true
    });
    const mesh = new Mesh(geometry, material);
    mesh.scale.setScalar(0.8);
    return new Enemy(mesh, 1, 100, 'miniGunstar');
}

export function createForgeHauler() {
    const group = new Group();
    const torus = new Mesh(new TorusGeometry(1, 0.3, 8, 16), new MeshStandardMaterial({ color: 0xff6600, wireframe: true }));
    group.add(torus);
    const podGeometry = new BoxGeometry(0.5, 0.5, 0.5);
    const podMaterial = new MeshStandardMaterial({ color: 0xffaa00, wireframe: true });
    const offsets = [ [1,0,0], [-1,0,0], [0,1,0], [0,-1,0] ];
    offsets.forEach(offset => {
        const pod = new Mesh(podGeometry, podMaterial);
        pod.position.set(offset[0]*1.2, offset[1]*1.2, 0);
        group.add(pod);
    });
    return new Enemy(group, 3, 300, 'forgeHauler');
}

export function createDroneSwarm() {
    const group = new Group();
    for(let i=0;i<8;i++) {
        const drone = new Mesh(new ConeGeometry(0.3, 1, 8), new MeshStandardMaterial({ color: 0x00ff00, wireframe: true }));
        const angle = (i/8)*Math.PI*2;
        drone.position.set(Math.cos(angle)*1.5, Math.sin(angle)*1.5, 0);
        group.add(drone);
    }
    return new Enemy(group, 1, 150, 'droneSwarm');
}

export function createCommandCarrier() {
    const group = new Group();
    const hull = new Mesh(new TorusGeometry(1.5, 0.4, 16, 32), new MeshStandardMaterial({ color: 0x00ffff, wireframe: true }));
    group.add(hull);
    for(let i=0;i<4;i++) {
        const shield = new Mesh(new TorusGeometry(0.4,0.1,8,16), new MeshStandardMaterial({ color:0x00ffff, emissive:0x003333, wireframe:true }));
        const angle = (i/4)*Math.PI*2;
        shield.position.set(Math.cos(angle)*2, Math.sin(angle)*2, 0);
        group.add(shield);
    }
    const turret = createMiniGunstar().mesh;
    turret.position.set(0,0,1);
    turret.userData.isTurret = true;
    group.add(turret);
    return new Enemy(group, 10, 1000, 'commandCarrier');
}
