import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Line, OrbitControls, Points, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'

export type NodeId = 'hub' | 'skills' | 'projects' | 'now' | 'collab'

type NodeDef = {
  id: NodeId
  position: [number, number, number]
  color: string
  label: string
}

const NODE_DISTANCE = 8

const nodes: NodeDef[] = [
  { id: 'hub', position: [0, 0, 0], color: '#77e2ff', label: 'Welcome' },
  { id: 'skills', position: [NODE_DISTANCE, 0, 0], color: '#00ffff', label: 'Skills' },
  { id: 'projects', position: [0, 0, -NODE_DISTANCE], color: '#ff88ff', label: 'Projects' },
  { id: 'now', position: [-NODE_DISTANCE, 0, 0], color: '#a78bfa', label: 'Now Building' },
  { id: 'collab', position: [0, 0, NODE_DISTANCE], color: '#64ffda', label: 'Collaborate' },
]

function useLerpedCamera(target: THREE.Vector3) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.lerp(
      new THREE.Vector3(target.x, target.y + 1.5, target.z + 8),
      0.05
    )
    camera.lookAt(target)
  })
}

function Hub() {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (mesh.current) {
      const s = 1 + Math.sin(t * 2) * 0.04
      mesh.current.scale.setScalar(s)
    }
  })
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial color={'#77e2ff'} emissive={'#2ec5ff'} emissiveIntensity={1.2} roughness={0.25} metalness={0.2} />
    </mesh>
  )
}

function HexPrism() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1, 1, 0.8, 6]} />
      <meshStandardMaterial color={'#00ffff'} emissive={'#0cf'} emissiveIntensity={0.8} roughness={0.3} metalness={0.3} />
    </mesh>
  )
}

function ProjectCluster() {
  const g = new THREE.SphereGeometry(0.35, 32, 32)
  const m = new THREE.MeshStandardMaterial({ color: '#ff88ff', emissive: '#ff55ff', emissiveIntensity: 0.8 })
  const r = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (r.current) r.current.rotation.y = t * 0.4
  })
  return (
    <group ref={r}>
      <mesh geometry={g} material={m} position={[0.9, 0, 0]} />
      <mesh geometry={g} material={m} position={[-0.9, 0.3, -0.2]} />
      <mesh geometry={g} material={m} position={[0.2, -0.7, 0.4]} />
    </group>
  )
}

function Hourglass() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.9, 1, 48]} />
        <meshStandardMaterial color={'#a78bfa'} emissive={'#a78bfa'} emissiveIntensity={0.6} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.9, 1, 48]} />
        <meshStandardMaterial color={'#a78bfa'} emissive={'#a78bfa'} emissiveIntensity={0.6} transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

function CollabSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 48, 48]} />
      <meshPhysicalMaterial transmission={0.9} thickness={0.6} roughness={0.1} color={'#64ffda'} />
    </mesh>
  )
}

function Node({ def, onSelect }: { def: NodeDef; onSelect: (id: NodeId) => void }) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!group.current) return
    const target = 1 + (hovered ? 0.08 : 0)
    const s = THREE.MathUtils.lerp(group.current.scale.x, target, 0.1)
    group.current.scale.setScalar(s)
    group.current.position.y = Math.sin(t + def.position[0]) * 0.2
    if (def.id === 'skills' || def.id === 'projects') group.current.rotation.y += 0.01
  })

  return (
    <group
      ref={group}
      position={def.position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(def.id) }}
    >
      {def.id === 'hub' && <Hub />}
      {def.id === 'skills' && <HexPrism />}
      {def.id === 'projects' && <ProjectCluster />}
      {def.id === 'now' && <Hourglass />}
      {def.id === 'collab' && <CollabSphere />}
      {def.id !== 'hub' && (
        <Html center distanceFactor={8} transform>
          <div className="px-3 py-1 rounded-md bg-secondary/60 backdrop-blur text-sm text-foreground border border-border">
            {def.label}
          </div>
        </Html>
      )}
    </group>
  )
}

function Connections() {
  const lines = useMemo(() => {
    const hub = nodes.find((n) => n.id === 'hub')!
    return nodes.filter((n) => n.id !== 'hub').map((n) => [hub.position, n.position])
  }, [])
  const dashRef = useRef<any>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (dashRef.current) (dashRef.current as any).dashOffset = -t * 0.4
  })
  return (
    <group>
      {lines.map((p, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(...p[0]), new THREE.Vector3(...p[1])]}
          color={'#7dd3fc'}
          lineWidth={1.5}
          dashed
          dashSize={0.3}
          gapSize={0.2}
          alphaTest={0.5}
          transparent
          opacity={0.85}
          onUpdate={(l: any) => {
            // @ts-ignore
            dashRef.current = l.material
          }}
        />
      ))}
    </group>
  )
}

function Starfield() {
  return <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
}

function SparkleParticles() {
  const count = 400
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 18 + Math.random() * 40
      const phi = Math.random() * Math.PI * 2
      const theta = Math.acos(2 * Math.random() - 1)
      arr[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi)
      arr[i * 3 + 1] = r * Math.cos(theta)
      arr[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi)
    }
    return arr
  }, [])
  const mat = useMemo(() => new THREE.PointsMaterial({ size: 0.04, color: '#f5d142', transparent: true, opacity: 0.8 }), [])
  const ref = useRef<THREE.Points>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.02
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial attach="material" args={[mat]} />
    </points>
  )
}

export function MultiverseScene({ selected, onSelect }: { selected: NodeId | null; onSelect: (n: NodeId) => void }) {
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const selPos = useMemo(() => {
    const s = nodes.find((n) => n.id === (selected ?? 'hub'))
    return new THREE.Vector3(...(s?.position ?? [0, 0, 0]))
  }, [selected])
  useLerpedCamera(selPos)

  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 55 }} dpr={[1, 2]}>
      <color attach="background" args={[new THREE.Color('#020617')]} />
      <fog attach="fog" args={[0x020617, 40, 120]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={'#88ccff'} />
      <pointLight position={[-6, -3, -4]} intensity={0.8} color={'#ff99ff'} />

      <Starfield />
      <SparkleParticles />
      <Connections />

      {nodes.map((n) => (
        <Node key={n.id} def={n} onSelect={onSelect} />
      ))}

      <Html position={[0, -2.2, 0]} center>
        <div className="text-center max-w-xl">
          <p className="text-sm text-muted-foreground animate-fade-in">Hey 👋 Interested in some fresh tech talks and collabs?….🙂</p>
          <p className="mt-2 text-base md:text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '120ms' } as any}>
            I’m a developer with a curious mind and a passion for creating things that make a difference...
          </p>
        </div>
      </Html>

      <OrbitControls enablePan={false} enableRotate enableZoom zoomSpeed={0.6} rotateSpeed={0.6} dampingFactor={0.08} />
    </Canvas>
  )
}
