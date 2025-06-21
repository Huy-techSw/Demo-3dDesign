"use client"

import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useState, useEffect, RefObject } from "react"
import * as THREE from "three"

const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

const BoxWithEdges = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhysicalMaterial 
          color="#0070f3"
          roughness={0.1}
          metalness={0.8}
          transparent={true}
          opacity={0.9}
          transmission={0.5}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 0.5)]} />
        <lineBasicMaterial color="#214dbd" />
      </lineSegments>
    </group>
  )
}

type LetterKey = 'N' | 'E' | 'X' | 'T'

const BoxLetter = ({ letter, position }: { letter: LetterKey, position: [number, number, number] }) => {
  const group = useRef<THREE.Group>(null)

  const getLetterShape = (letter: LetterKey): number[][] => {
    const shapes: Record<LetterKey, number[][]> = {
      N: [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
      ],
      E: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 0],
        [1, 0, 0],
        [1, 1, 1],
      ],
      X: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1],
      ],
      T: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    }
    return shapes[letter]
  }

  const letterShape = getLetterShape(letter)

  return (
    <group ref={group} position={position}>
      {letterShape.map((row, i) =>
        row.map((cell, j) => {
          if (!cell) return null

          let xOffset = j * 0.5

          if (letter === 'N') {
            xOffset = [-0.5, 0, 0.25, 0.5, 1][j]
          }

          if (letter === 'X') {
            xOffset = [-1, -0.75, -0.25, 0.25, 0.5][j]
          }

          if (letter === 'T') {
            xOffset -= 0.75
          }

          if (letter === 'E') {
            xOffset -= 0.5
          }

          return (
            <BoxWithEdges
              key={`${i}-${j}`}
              position={[xOffset, (4 - i) * 0.5 - 1, 0]}
            />
          )
        })
      )}
    </group>
  )
}

const Scene = () => {
  const orbitControlsRef = useRef(null)
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false)

  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  return (
    <>
      <group position={[-0.5, 0, 0]} rotation={[0, Math.PI / 1.5, 0]}>
        <BoxLetter letter="N" position={[-3.75, 0, 0]} />
        <BoxLetter letter="E" position={[-1.25, 0, 0]} />
        <BoxLetter letter="X" position={[1.25, 0, 0]} />
        <BoxLetter letter="T" position={[3.75, 0, 0]} />
      </group>

      <OrbitControls
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={2}
      />

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />

      <Environment
        files={
          isMobileDevice
            ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download3-7FArHVIJTFszlXm2045mQDPzsZqAyo.jpg"
            : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dither_it_M3_Drone_Shot_equirectangular-jpg_San_Francisco_Big_City_1287677938_12251179%20(1)-NY2qcmpjkyG6rDp1cPGIdX0bHk3hMR.jpg"
        }
        background
      />
    </>
  )
}

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [10.047021, -0.127436, -11.137374], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
