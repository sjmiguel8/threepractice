'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { WebGLRenderer } from 'three';

const ThreeScene = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  loader.load(
      '/medieval_camp.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            // Optional: Adjust material properties here
            
          }
        });
        if (meshRef.current) {
          meshRef.current.add(gltf.scene);
        }
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('An error happened loading the GLB:', error);
      }
    );

    

    return () => {
      // Dispose of resources here
    };
  }, []);



  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
};

export default ThreeScene;