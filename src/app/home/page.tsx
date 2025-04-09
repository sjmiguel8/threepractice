import { Canvas } from '@react-three/fiber'

function Model() {
    return (
        <mesh rotation={[Math.PI, 0, 0]}>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    )
}

export default function Home() {
    return (
        <Canvas style={{ background: 'skyblue' }}>
            <ambientLight intensity={20.5} />
            <pointLight position={[20, 20, 20]} />
            <Model />
            </Canvas>
    )
}


