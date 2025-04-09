'use client'

import { Canvas } from '@react-three/fiber'
import ThreeScene from '@/components/ThreeScene'
import { Suspense } from 'react'
import { OrbitControls } from '@react-three/drei'

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas style={{ background:'rgba(117, 124, 222, 0.73)' }}>
        <Suspense fallback={null}>
          <ThreeScene />
          <OrbitControls />
          <axesHelper args={[5]} />
          <gridHelper args={[100, 100]} position={[0, 0, 0]} />
          <mesh position={[0, 0, 0]}>
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
          <ambientLight intensity={20.5} />
          <pointLight position={[20, 20, 20]} intensity={1} />
          <directionalLight position={[0, 10, 0]} intensity={1} />
          <hemisphereLight intensity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}