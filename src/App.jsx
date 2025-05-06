import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./App.css";

function GLBModel({ path, position, scale = [0.1, 0.1, 0.1] }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} position={position} scale={scale} />;
}

function HouseScene({ extensions }) {
  const houseRef = useRef();
  const texture = useTexture("/textures/wall.png"); // Your PNG path

  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <group ref={houseRef}>
        {/* Main House */}
        <GLBModel
          path="/models/house_3d_hd.glb"
          position={[0, 0, 0]}
          scale={[0.05, 0.05, 0.05]}
        />

        {/* Extensions with texture */}
        {extensions.includes("left") && (
          <mesh position={[-38, 17.5, 21]}>
            <boxGeometry args={[25, 35, 55]} />
            <meshStandardMaterial map={texture} color="yellow" />
          </mesh>
        )}

        {extensions.includes("right") && (
          <mesh position={[30, 16, -5]}>
            <boxGeometry args={[10, 31, 88]} />
            <meshStandardMaterial map={texture} color="pink" />
          </mesh>
        )}

        {extensions.includes("rear") && (
          <mesh position={[6, 16, -59]}>
            <boxGeometry args={[40, 32, 20]} />
            <meshStandardMaterial map={texture} color="orange" />
          </mesh>
        )}
      </group>
      <OrbitControls />
    </Suspense>
  );
}

export default function App() {
  const [extensions, setExtensions] = useState([]);

  const toggleExtension = (side) => {
    setExtensions((prev) =>
      prev.includes(side) ? prev.filter((s) => s !== side) : [...prev, side]
    );
  };

  return (
    <>
      <Header />

      <main className="layout">
        <div className="canvas-container">
          <Canvas camera={{ position: [0, 0, 200] }}>
            <HouseScene extensions={extensions} />
          </Canvas>
        </div>

        <aside className="sidebar">
          <h2>Extensions</h2>
          <div>
            <label>
              <input
                type="checkbox"
                checked={extensions.includes("left")}
                onChange={() => toggleExtension("left")}
              />
              Left
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={extensions.includes("right")}
                onChange={() => toggleExtension("right")}
              />
              Right
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={extensions.includes("rear")}
                onChange={() => toggleExtension("rear")}
              />
              Rear
            </label>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
}

// Required to load GLB models
useGLTF.preload("/models/house_3d_hd.glb");
