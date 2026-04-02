"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function DashboardScene({ className = "" }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const rendererRef = useRef(null);
  const { resolvedTheme, theme } = useTheme();

  useEffect(() => {
    let mounted = true;
    let scene;
    let camera;

    const init = async () => {
      const THREE = await import("three");
      if (!mounted || !canvasRef.current) {
        return undefined;
      }

      const canvas = canvasRef.current;
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 0, 6);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      rendererRef.current = renderer;

      const resize = () => {
        if (!canvas.parentElement) {
          return;
        }

        const width = canvas.parentElement.clientWidth;
        const height = canvas.parentElement.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const themeIsDark =
        (theme === "system" ? resolvedTheme : theme) !== "light";

      const orb = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.45, 12),
        new THREE.MeshPhysicalMaterial({
          color: themeIsDark ? "#ff8f45" : "#ea580c",
          emissive: themeIsDark ? "#14b8a6" : "#0f766e",
          emissiveIntensity: themeIsDark ? 0.45 : 0.2,
          roughness: 0.18,
          metalness: 0.35,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
        }),
      );
      scene.add(orb);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.05, 16, 180),
        new THREE.MeshBasicMaterial({
          color: themeIsDark ? "#67e8f9" : "#0f766e",
          transparent: true,
          opacity: themeIsDark ? 0.75 : 0.45,
        }),
      );
      ring.rotation.x = Math.PI / 2.4;
      ring.rotation.y = Math.PI / 4.5;
      scene.add(ring);

      const particleCount = 140;
      const positions = new Float32Array(particleCount * 3);

      for (let index = 0; index < particleCount; index += 1) {
        const stride = index * 3;
        positions[stride] = (Math.random() - 0.5) * 8;
        positions[stride + 1] = (Math.random() - 0.5) * 5;
        positions[stride + 2] = (Math.random() - 0.5) * 6;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: themeIsDark ? "#f8fafc" : "#0f172a",
          size: themeIsDark ? 0.04 : 0.03,
          transparent: true,
          opacity: themeIsDark ? 0.85 : 0.35,
        }),
      );
      scene.add(particles);

      const ambientLight = new THREE.AmbientLight(
        themeIsDark ? "#ffffff" : "#f8fafc",
        themeIsDark ? 1.3 : 1.15,
      );
      const pointLight = new THREE.PointLight(
        themeIsDark ? "#fb7185" : "#f97316",
        themeIsDark ? 24 : 18,
        100,
      );
      pointLight.position.set(3, 3, 5);
      const fillLight = new THREE.PointLight(
        themeIsDark ? "#22d3ee" : "#0891b2",
        themeIsDark ? 14 : 10,
        100,
      );
      fillLight.position.set(-3.5, -2, 4);

      scene.add(ambientLight, pointLight, fillLight);

      resize();
      window.addEventListener("resize", resize);

      const animate = () => {
        if (!mounted) {
          return;
        }

        orb.rotation.x += 0.0035;
        orb.rotation.y += 0.005;
        ring.rotation.z += 0.004;
        particles.rotation.y -= 0.0009;

        renderer.render(scene, camera);
        frameRef.current = window.requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", resize);
      };
    };

    let cleanupResize;
    init().then((disposeResize) => {
      cleanupResize = disposeResize;
    });

    return () => {
      mounted = false;
      if (cleanupResize) {
        cleanupResize();
      }
      window.cancelAnimationFrame(frameRef.current);
      rendererRef.current?.dispose();
      scene?.traverse((node) => {
        if (node.geometry) {
          node.geometry.dispose();
        }
        if (node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach((material) => material.dispose());
          } else {
            node.material.dispose();
          }
        }
      });
    };
  }, [resolvedTheme, theme]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
