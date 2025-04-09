"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Model() {
    return (
        <mesh rotation={[Math.PI, 0, 0]}>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    );
}

export default function Store() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas style={{ background: 'skyblue' }}>
                <OrbitControls />
                <ambientLight intensity={0.5} />
                <pointLight position={[20, 20, 20]} />
                <Model />
            </Canvas>
        </div>
    );
}


