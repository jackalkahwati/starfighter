// Player ship creation module
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';

const { Group, Mesh, Shape, ExtrudeGeometry, MeshStandardMaterial,
        CylinderGeometry, SphereGeometry, MeshBasicMaterial, LineSegments } = THREE;

export function createPlayerShip() {
    const shipGroup = new Group();

    const fuselageShape = new Shape();
    fuselageShape.moveTo(0, 0.6);
    fuselageShape.lineTo(-0.4, 0.2);
    fuselageShape.lineTo(-0.4, -0.8);
    fuselageShape.lineTo(0.4, -0.8);
    fuselageShape.lineTo(0.4, 0.2);
    fuselageShape.lineTo(0, 0.6);

    const extrudeSettings = { depth: 2.5, bevelEnabled: false };
    const fuselageGeo = new ExtrudeGeometry(fuselageShape, extrudeSettings);
    fuselageGeo.center();
    fuselageGeo.rotateX(Math.PI / 2);

    const fuselageMat = new MeshStandardMaterial({
        color: 0x3a3a5e,
        metalness: 0.6,
        roughness: 0.4,
        flatShading: true
    });
    const fuselage = new Mesh(fuselageGeo, fuselageMat);
    shipGroup.add(fuselage);

    const wingShape = new Shape();
    wingShape.moveTo(0.4, 0);
    wingShape.lineTo(2.5, -0.5);
    wingShape.lineTo(2.0, -1.5);
    wingShape.lineTo(0.4, -1.0);

    const wingExtrudeSettings = { depth: 0.15, bevelEnabled: false };
    const wingGeo = new ExtrudeGeometry(wingShape, wingExtrudeSettings);
    wingGeo.translate(0, 0, -0.075);

    const wingMat = new MeshStandardMaterial({
        color: 0x4f4f7a,
        metalness: 0.5,
        roughness: 0.5,
        flatShading: true
    });

    const wingRight = new Mesh(wingGeo, wingMat);
    wingRight.position.set(0, 0, -0.2);
    shipGroup.add(wingRight);

    const wingLeft = new Mesh(wingGeo.clone(), wingMat);
    wingLeft.scale.x = -1;
    wingLeft.position.set(0, 0, -0.2);
    shipGroup.add(wingLeft);

    const engineGeo = new CylinderGeometry(0.25, 0.35, 1.0, 8);
    engineGeo.rotateX(Math.PI / 2);
    engineGeo.translate(0, 0, 0.9);
    const engineMat = new MeshStandardMaterial({
        color: 0x2c2c4a,
        metalness: 0.7,
        roughness: 0.3,
        flatShading: true
    });

    const engineRight = new Mesh(engineGeo, engineMat);
    engineRight.position.x = 0.8;
    engineRight.position.y = -0.4;
    shipGroup.add(engineRight);

    const engineLeft = new Mesh(engineGeo.clone(), engineMat);
    engineLeft.position.x = -0.8;
    engineLeft.position.y = -0.4;
    shipGroup.add(engineLeft);

    const engineGlowMat = new MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8
    });
    const engineGlowGeo = new SphereGeometry(0.3, 16, 8);
    engineGlowGeo.translate(0, 0, 1.4);

    const glowRight = new Mesh(engineGlowGeo, engineGlowMat);
    glowRight.position.x = 0.8;
    glowRight.position.y = -0.4;
    shipGroup.add(glowRight);

    const glowLeft = new Mesh(engineGlowGeo.clone(), engineGlowMat);
    glowLeft.position.x = -0.8;
    glowLeft.position.y = -0.4;
    shipGroup.add(glowLeft);

    const cockpitGeo = new SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI/2);
    cockpitGeo.rotateX(Math.PI / 2);
    cockpitGeo.translate(0, 0.25, -0.3);
    const cockpitMat = new MeshStandardMaterial({
        color: 0xaaaaee,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5
    });
    const cockpit = new Mesh(cockpitGeo, cockpitMat);
    shipGroup.add(cockpit);

    const detailMat = new MeshBasicMaterial({ color: 0x00ffff });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.6, -0.2, -0.1), new THREE.Vector3(1.8, -0.6, -0.1),
        new THREE.Vector3(0.6, -0.8, -0.1), new THREE.Vector3(1.5, -1.2, -0.1)
    ]);
    const detailLinesRight = new LineSegments(lineGeo, detailMat);
    shipGroup.add(detailLinesRight);

    const detailLinesLeft = new LineSegments(lineGeo.clone(), detailMat);
    detailLinesLeft.scale.x = -1;
    shipGroup.add(detailLinesLeft);

    shipGroup.scale.setScalar(0.8);
    return shipGroup;
}
