"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF as useGLTFDraco, OrbitControls, PerspectiveCamera, Gltf } from '@react-three/drei';
import * as THREE from 'three';

// Movement mode enum to handle different control states
enum MovementMode {
  IDLE,
  KEYBOARD,
}

// Scene type enum
enum SceneType {
  HOME = 'home',
  POKEMON_CENTER = 'pokemonCenter'
}

// Function to load GLTF models
const useGLTF = (path: string): THREE.Group => {
    const { scene } = useGLTFDraco(path);
    return scene as THREE.Group;
};

// Load the Home model
const Home = () => {
    const gltf = useGLTF("/ground.glb");
    return <primitive object={gltf} position={[0, -2.5, 0]} scale={[19.1, 0.1, 19.1]} />;
};
    

// Load the Pokemon Center model
const PokemonCenter = () => {
    const gltf = useGLTF("/pokemon_rse_-_pokemon_center.glb");
    return <primitive object={gltf} position={[20, -2.5, 20]} scale={0.1} />;
};

// Main character model with controls
const Character = () => {
    const gltf = useGLTF("/abel__lowpoly_character.glb");
    const [position, setPosition] = useState(new THREE.Vector3(0, 6.7, 0));
    const [rotation, setRotation] = useState(new THREE.Euler(0, 0, 0));
    const [movementMode, setMovementMode] = useState(MovementMode.IDLE);

    const characterRef = useRef<THREE.Group>(null);
    const { camera, scene, gl } = useThree();

    const speed = 0.3;
    const rotationSpeed = 0.1;

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

    // Animation loop for movement and rotation
    useFrame((_, delta) => {
        if (!characterRef.current) return;

        let moveX = 0;
        let moveZ = 0;
        let targetRotation = rotation;
        let moved = false;

        // Handle keyboard movement
        if (movementMode === MovementMode.KEYBOARD) {
            const forwardVector = new THREE.Vector3();
            camera.getWorldDirection(forwardVector);
            forwardVector.y = 0;
            forwardVector.normalize();

            const sideVector = new THREE.Vector3();
            sideVector.crossVectors(camera.up, forwardVector);
            sideVector.normalize();

            if (keysPressed.current['w']) {
                moveX += forwardVector.x;
                moveZ += forwardVector.z;
                moved = true;
            }
            if (keysPressed.current['s']) {
                moveX -= forwardVector.x;
                moveZ -= forwardVector.z;
                moved = true;
            }
            if (keysPressed.current['a']) {
                moveX += sideVector.x;
                moveZ += sideVector.z;
                moved = true;
            }
            if (keysPressed.current['d']) {
                moveX -= sideVector.x;
                moveZ -= sideVector.z;
                moved = true;
            }

            if (moved) {
                const moveVector = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(speed);
                setPosition(prev => new THREE.Vector3(
                    prev.x + moveVector.x,
                    prev.y,
                    prev.z + moveVector.z
                ));

                // Calculate rotation based on movement direction
                targetRotation = new THREE.Euler(0, Math.atan2(moveVector.x, moveVector.z), 0);
            }
        }

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
            object={gltf}
            scale={0.8}
            name="character"
        />
    );
}
function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} name="ground">
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial visible={false} />
            <primitive object={useGLTF("/ground.glb")} scale={1} />
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
            position={[0, 50, 10]}
            fov={20}
        />
    );
}

// Settings icon component
const SettingsButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <div 
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 100
            }}
            onClick={onClick}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeWidth="2" />
                <path d="M19.4 15C19.1277 15.8031 19.2583 16.6812 19.75 17.3750L19.81 17.4450C20.1428 17.7779 20.3463 18.2106 20.3854 18.6717C20.4245 19.1329 20.2973 19.5934 20.025 19.9725C19.7527 20.3516 19.3518 20.629 18.8935 20.7592C18.4352 20.8894 17.9468 20.864 17.505 20.6875L17.425 20.655C16.7312 20.3419 15.9399 20.3419 15.2462 20.655C14.5524 20.9682 14.0465 21.5513 13.85 22.25L13.825 22.35C13.725 22.8048 13.4668 23.2097 13.0939 23.4899C12.7211 23.7701 12.2583 23.9066 11.795 23.875C11.3313 23.8455 10.8941 23.6488 10.565 23.3218C10.2359 22.9947 10.0357 22.5589 10 22.095L10.005 21.9625C9.86121 21.2553 9.4358 20.64 8.8112 20.2628C8.18661 19.8855 7.43581 19.7783 6.725 19.97L6.57504 20.015C6.11323 20.1916 5.62487 20.2169 5.16655 20.0867C4.70822 19.9566 4.30737 19.6792 4.03508 19.3C3.76279 18.9209 3.63552 18.4605 3.67464 17.9993C3.71376 17.5382 3.91726 17.1054 4.25004 16.7725L4.33004 16.6875C4.82172 15.9938 4.95237 15.1156 4.68004 14.3125C4.40771 13.5094 3.77461 12.8763 2.97154 12.604L2.87504 12.575C2.4203 12.475 2.01535 12.2168 1.73518 11.8439C1.455 11.4711 1.31845 11.0083 1.35004 10.545C1.37953 10.0813 1.57615 9.64413 1.90323 9.31498C2.2303 8.98584 2.66608 8.78566 3.13004 8.75L3.26254 8.745C4.0139 8.66853 4.69579 8.29052 5.14978 7.7007C5.60378 7.11087 5.79133 6.36314 5.67504 5.625L5.65004 5.5C5.55144 5.04998 5.62336 4.58324 5.85309 4.17503C6.08282 3.76681 6.45744 3.44499 6.91004 3.265C7.36263 3.08457 7.86333 3.05522 8.33255 3.18161C8.80177 3.308 9.21169 3.58345 9.50004 3.96L9.57504 4.0525C10.1417 4.66597 10.9243 5.02406 11.75 5.02406C12.5757 5.02406 13.3583 4.66597 13.925 4.0525L14 3.96C14.2884 3.58345 14.6983 3.308 15.1675 3.18161C15.6367 3.05522 16.1374 3.08457 16.59 3.265C17.0426 3.44499 17.4173 3.76681 17.647 4.17503C17.8767 4.58324 17.9486 5.04998 17.85 5.5L17.825 5.625C17.7087 6.36314 17.8963 7.11087 18.3503 7.7007C18.8043 8.29052 19.4861 8.66853 20.2375 8.745L20.37 8.75C20.834 8.78566 21.2698 8.98584 21.5968 9.31498C21.9239 9.64413 22.1205 10.0813 22.15 10.545C22.1816 11.0083 22.045 11.4711 21.7649 11.8439C21.4847 12.2168 21.0798 12.475 20.625 12.575L20.5275 12.604C19.7245 12.8763 19.0914 13.5094 18.819 14.3125C18.5467 15.1156 18.6773 15.9938 19.169 16.6875L19.25 16.7725C19.5828 17.1054 19.7863 17.5382 19.8254 17.9993C19.8646 18.4605 19.7373 18.9209 19.465 19.3C19.1927 19.6792 18.7919 19.9566 18.3335 20.0867C17.8752 20.2169 17.3869 20.1916 16.945 20.015L16.865 19.9825C16.5318 19.8713 16.1768 19.8407 15.8281 19.894C15.4793 19.9472 15.1479 20.0828 14.86 20.29C14.5721 20.4972 14.335 20.7698 14.1703 21.085C14.0055 21.4002 13.9178 21.7495 13.915 22.105" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

interface CoinProps {
    boundary: [number, number, number, number];
}

const Coin: React.FC<CoinProps> = ({ boundary }) => {
    const [xMin, xMax, zMin, zMax] = boundary;

    const x = Math.random() * (xMax - xMin) + xMin;
    const z = Math.random() * (zMax - zMin) + zMin;
    const gltf = useGLTF("/coin.glb");

    return (
        <primitive
            object={gltf}
            scale={0.06}
            position={[x, 1, z]}
        />
    );
};

interface ThreeSceneProps {
}

const NUM_COINS = 10;

export default function ThreeScene({ }: ThreeSceneProps) {
    const [currentScene, setCurrentScene] = useState<SceneType>(SceneType.HOME);
    const maxZoomDistance = 100;

    const toggleScene = () => {
        setCurrentScene(prev =>
            prev === SceneType.HOME ?
                SceneType.POKEMON_CENTER :
                SceneType.HOME
        );
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <SettingsButton onClick={toggleScene} />
            <Canvas shadows>
                <color attach="background" args={['skyblue']} />
                {/* Camera with orbit controls */}
                <GameCamera />
                <OrbitControls
                    target={[0, 0, 0]}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
                    minDistance={2}
                    maxDistance={maxZoomDistance}
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
                    groundColor="#553300"
                    color="#aaccff"
                />
                {/* Interactive ground plane for click detection */}
                <Ground />
                {/* Helpers */}
                <axesHelper args={[5]} />
                <gridHelper args={[100, 100]} position={[0, -2, 0]} />

                {/* Game objects based on current scene */}
                {currentScene === SceneType.HOME ? (
                    <>
                        <Character />
                        <Home />
                        {/* Coins */}
                        {Array.from({ length: NUM_COINS }).map((_, i) => (
                            <Coin key={i} boundary={[-10, 10, -10, 10]} />
                        ))}
                    </>
                ) : (
                    <>
                        <Character />
                        <PokemonCenter />
                        {/* Coins */}
                        {Array.from({ length: NUM_COINS }).map((_, i) => (
                            <Coin key={i} boundary={[-5, 5, -5, 5]} />
                        ))}
                    </>
                )}
            </Canvas>
        </div>
    );
}