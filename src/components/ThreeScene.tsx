"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Movement mode enum to handle different control states
enum MovementMode {
  IDLE,
  KEYBOARD,
}

// Main character model with controls
const Character = () => {
    const gltf = useGLTF("/lowpoly_animated_warrior.glb");
    const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
    const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
    const [movementMode, setMovementMode] = useState(MovementMode.IDLE);
    
    const characterRef = useRef<THREE.Group>(null);
    const { camera, scene, gl } = useThree();
    
    const speed = 0.1;
    const rotationSpeed = 0.1;
    const clickMoveSpeed = 0.05;
    
    // Track pressed keys for smoother movement
    const keysPressed = useRef<Record<string, boolean>>({});
    
    // Handle keyboard movement
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current[event.key.toLowerCase()] = true;
            if (['w', 'a', 's', 'd'].includes(event.key.toLowerCase())) {
                setMovementMode(MovementMode.KEYBOARD);
            }
        };
        
        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current[event.key.toLowerCase()] = false;
            
            // Check if any movement keys are still pressed
            if (!['w', 'a', 's', 'd'].some(key => keysPressed.current[key])) {
                setMovementMode(MovementMode.IDLE);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    
    // Handle click movement
    
    
    // Animation loop for movement and rotation
    useFrame((_, delta) => {
        if (!characterRef.current) return;
        
        let moveX = 0;
        let moveZ = 0;
        let targetRotation = rotation;
        let moved = false;
        
        // Handle keyboard movement
        if (movementMode === MovementMode.KEYBOARD) {
            // Calculate movement based on pressed keys
            if (keysPressed.current['w']) {
                moveZ -= speed;
                targetRotation = new THREE.Euler(0, Math.PI, 0);
                moved = true;
            }
            if (keysPressed.current['s']) {
                moveZ += speed;
                targetRotation = new THREE.Euler(0, 0, 0);
                moved = true;
            }
            if (keysPressed.current['a']) {
                moveX -= speed;
                targetRotation = new THREE.Euler(0, Math.PI / 2, 0);
                moved = true;
            }
            if (keysPressed.current['d']) {
                moveX += speed;
                targetRotation = new THREE.Euler(0, -Math.PI / 2, 0);
                moved = true;
            }
            
            // Handle diagonal movement
            if ((keysPressed.current['w'] && keysPressed.current['a']) ||
                (keysPressed.current['w'] && keysPressed.current['d']) ||
                (keysPressed.current['s'] && keysPressed.current['a']) ||
                (keysPressed.current['s'] && keysPressed.current['d'])) {
                
                // Normalize diagonal movement to prevent faster diagonal speed
                const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
                if (length > 0) {
                    moveX = (moveX / length) * speed;
                    moveZ = (moveZ / length) * speed;
                }
                
                // Calculate rotation for diagonal movement
                targetRotation = new THREE.Euler(0, Math.atan2(moveX, -moveZ), 0);
            }
            
            if (moved) {
                // Apply movement
                setPosition(prev => new THREE.Vector3(
                    prev.x + moveX,
                    prev.y,
                    prev.z + moveZ
                ));
            }
        }
        // Handle click-to-move
        
        
        // Smoothly interpolate rotation towards target rotation
        if (moved && characterRef.current) {
            characterRef.current.rotation.y += (targetRotation.y - characterRef.current.rotation.y) * rotationSpeed;
            setRotation(new THREE.Euler(0, characterRef.current.rotation.y, 0));
        }
        
        // Update character position
        characterRef.current.position.copy(position);
    });
    
    return (
        <primitive
            ref={characterRef}
            object={gltf.scene}
            scale={0.6}
            name="character"
        />
    );
};

// Environment model
function Environment() {
    const gltf = useGLTF("/the_king_s_hall.glb");
    return (
        <primitive 
            object={gltf.scene}
            scale={1.8}
            rotation={[0, 0, 0]}
            position={[1, 2.3, -6]}
        />
    );
}

// Ground plane for click detection
function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} name="ground">
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial visible={false} />
        </mesh>
    );
}

// Game camera setup
function GameCamera() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    
    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={[0, 10, 10]}
            fov={50}
        />
    );
}

export default function ThreeScene() {
    return (
        <Canvas shadows>
            <color attach="background" args={['skyblue']} />
            
            {/* Camera with orbit controls */}
            <GameCamera />
            <OrbitControls 
                target={[0, 0, 0]}
                maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
                minDistance={5}
                maxDistance={30}
            />
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[20, 20, 20]} intensity={1} castShadow />
            <directionalLight 
                position={[0, 10, 0]} 
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-left={-20}
                shadow-camera-right={20}
                shadow-camera-top={20}
                shadow-camera-bottom={-20}
            />
            <hemisphereLight 
                intensity={0.3} 
                groundColor={new THREE.Color("#553300")}
                color={new THREE.Color("#aaccff")}
            />
            
            {/* Helpers */}
            <axesHelper args={[5]} />
            <gridHelper args={[100, 100]} position={[0, 0.01, 0]} />
            
            {/* Interactive ground plane for click detection */}
            <Ground />
            
            {/* Game objects */}
            <Character />
            <Environment />
        </Canvas>
    );
}