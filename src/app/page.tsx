'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the ThreeScene component with SSR disabled
const ThreeScene = dynamic(() => import('@/components/ThreeScene'), {
  ssr: false,
  loading: () => <div>Loading 3D scene...</div>
})

export default function Home() {
  return (

    <div style={{ width: '100vw', height: '100vh' }}>

      <Suspense fallback={<div>Loading...</div>}>

        <ThreeScene />

      </Suspense>
    </div>
  )
}