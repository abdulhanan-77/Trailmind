'use client';

import { useRef, useEffect, useState, Suspense, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, Html, useProgress } from '@react-three/drei';
import { AGENT_COMMAND_EVENT, AgentCommand } from '@/types/agent-commands';
import * as THREE from 'three';

// ========================================
// 🎨 Types
// ========================================
interface ProductViewerProps {
    modelUrl: string;
    productName?: string;
    autoRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    className?: string;
    onLoadComplete?: () => void;
    onError?: (error: Error) => void;
}

interface ModelProps {
    url: string;
    onLoaded?: () => void;
}

// ========================================
// 🔧 Loading Indicator
// ========================================
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-sm text-slate-600 font-medium">
                    {progress.toFixed(0)}%
                </span>
            </div>
        </Html>
    );
}

// ========================================
// 🎮 Camera Controller (Agent Commands)
// ========================================
function CameraController() {
    const { camera } = useThree();
    const targetRotation = useRef<{ x: number; y: number; z: number } | null>(null);
    const isAnimating = useRef(false);

    useEffect(() => {
        const handleAgentCommand = (event: Event) => {
            const customEvent = event as CustomEvent<AgentCommand>;
            const command = customEvent.detail;

            switch (command.action) {
                case 'ROTATE_MODEL':
                    if (command.coordinates) {
                        // Convert degrees to radians
                        targetRotation.current = {
                            x: THREE.MathUtils.degToRad(command.coordinates.x),
                            y: THREE.MathUtils.degToRad(command.coordinates.y),
                            z: THREE.MathUtils.degToRad(command.coordinates.z),
                        };
                        isAnimating.current = true;
                    }
                    break;
                case 'ZOOM_MODEL':
                    if (command.zoomLevel) {
                        camera.position.setLength(command.zoomLevel);
                    }
                    break;
                case 'RESET_VIEW':
                    camera.position.set(0, 0, 5);
                    camera.lookAt(0, 0, 0);
                    break;
            }
        };

        window.addEventListener(AGENT_COMMAND_EVENT, handleAgentCommand);
        return () => window.removeEventListener(AGENT_COMMAND_EVENT, handleAgentCommand);
    }, [camera]);

    useFrame(() => {
        if (isAnimating.current && targetRotation.current) {
            // Smooth camera orbit animation
            const { x, y } = targetRotation.current;
            const radius = camera.position.length();

            // Calculate new position on sphere
            const targetX = radius * Math.sin(y) * Math.cos(x);
            const targetY = radius * Math.sin(x);
            const targetZ = radius * Math.cos(y) * Math.cos(x);

            // Lerp to target
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
            camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
            camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
            camera.lookAt(0, 0, 0);

            // Check if animation is complete
            const distance = Math.abs(camera.position.x - targetX) +
                Math.abs(camera.position.y - targetY) +
                Math.abs(camera.position.z - targetZ);

            if (distance < 0.01) {
                isAnimating.current = false;
                targetRotation.current = null;
            }
        }
    });

    return null;
}

// ========================================
// 📦 3D Model Component
// ========================================
function Model({ url, onLoaded }: ModelProps) {
    const { scene } = useGLTF(url, true); // true enables Draco compression

    useEffect(() => {
        if (scene) {
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(scene);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim; // Fit within 2 units
            scene.scale.setScalar(scale);

            // Center the model
            const center = box.getCenter(new THREE.Vector3());
            scene.position.sub(center.multiplyScalar(scale));

            onLoaded?.();
        }
    }, [scene, onLoaded]);

    return <primitive object={scene} />;
}

// ========================================
// 🖼️ Error Fallback
// ========================================
function ErrorFallback({ message }: { message: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-xl">
            <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <p className="text-sm text-slate-600">{message}</p>
            </div>
        </div>
    );
}

// ========================================
// 🎯 Main ProductViewer Component
// ========================================
export default function ProductViewer({
    modelUrl,
    productName = '3D Product',
    autoRotate = true,
    enableZoom = true,
    enablePan = false,
    className = '',
    onLoadComplete,
    onError
}: ProductViewerProps) {
    const [error, setError] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        onLoadComplete?.();
    }, [onLoadComplete]);

    const handleError = useCallback((err: Error) => {
        setError(err.message || 'Failed to load 3D model');
        onError?.(err);
    }, [onError]);

    // Validate URL
    const isValidUrl = useMemo(() => {
        return modelUrl && (modelUrl.endsWith('.glb') || modelUrl.endsWith('.gltf'));
    }, [modelUrl]);

    if (!isValidUrl) {
        return <ErrorFallback message="Invalid 3D model format. Please use .glb or .gltf files." />;
    }

    if (error) {
        return <ErrorFallback message={error} />;
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full min-h-[300px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden ${className}`}
            role="img"
            aria-label={`3D view of ${productName}`}
        >
            {/* Canvas */}
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]} // Adaptive pixel ratio for performance
                gl={{ antialias: true, alpha: true }}
                onError={() => handleError(new Error('WebGL context error'))}
            >
                {/* Lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />

                {/* Environment for reflections */}
                <Environment preset="studio" />

                {/* Agent Command Controller */}
                <CameraController />

                {/* Model with loading state */}
                <Suspense fallback={<Loader />}>
                    <Center>
                        <Model url={modelUrl} onLoaded={handleLoad} />
                    </Center>
                </Suspense>

                {/* Orbit Controls */}
                <OrbitControls
                    enableZoom={enableZoom}
                    enablePan={enablePan}
                    autoRotate={autoRotate && isLoaded}
                    autoRotateSpeed={1.5}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI - Math.PI / 6}
                    minDistance={2}
                    maxDistance={10}
                />
            </Canvas>

            {/* Controls Hint */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs text-slate-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Drag to rotate • Scroll to zoom
            </div>

            {/* Loading overlay */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        <span className="text-sm text-slate-600">Loading 3D Model...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Preload helper for performance
export function preloadModel(url: string) {
    useGLTF.preload(url);
}
