import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Earth() {
  const ref = useRef();

  const { scene } = useGLTF("/earth.glb");

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}