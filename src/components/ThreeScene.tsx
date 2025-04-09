"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';

function Model() {
    const gltf = useGLTF("/phoenix_bird.glb");
    return (
        <primitive object={gltf.scene}
            scale={0.005}
            rotation={[0, 0, 0]}
            position={[0, 0, 0]}
        />
    );
}

// Function to load a GLTF model
function LoadGltfModel() {
    const gltf = useGLTF("/medieval_camp.glb");
    return (
        <primitive object={gltf.scene}
            scale={1}
            rotation={[0, 0, 0]}
            position={[0, 0, 0]}
        />
    );
}

export default function ThreeScene() {
    return (
        <Canvas style={{ background: 'skyblue' }}>
            <OrbitControls />
            <axesHelper args={[5]} />
            <gridHelper args={[100, 100]} position={[0, 0, 0]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[20, 20, 20]} intensity={1} />
            <directionalLight position={[0, 10, 0]} intensity={1} />
            <Model />
            <LoadGltfModel />
        </Canvas>
    );
}