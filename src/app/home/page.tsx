"use client";
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), {
    ssr: false,
    loading: () => <div>Loading...</div>,
});

export default function Home() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Suspense fallback={<div>Loading 3D scene...</div>}>
                <ThreeScene />
            </Suspense>
        </div>
    );
}


