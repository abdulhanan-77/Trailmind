'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ========================================
// 🎓 Tour Steps Configuration
// ========================================
interface TourStep {
    target: string;
    title: string;
    content: React.ReactNode;
    placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
    {
        target: '#tour-logo',
        title: 'Welcome to Trailmind! 🏔️',
        content: 'Your AI-powered outdoor gear shopping experience. Let us show you around.',
        placement: 'bottom',
    },
    {
        target: '#tour-search',
        title: 'Smart Search 🔍',
        content: 'Search for any product. Results appear instantly with images and prices. Click a result to view full details.',
        placement: 'bottom',
    },
    {
        target: '#tour-nav',
        title: 'Navigation 🧭',
        content: (
            <div>
                <strong>Discover</strong> - Browse products<br />
                <strong>Orders</strong> - Track your orders<br />
                <strong>Settings</strong> - Manage preferences
            </div>
        ),
        placement: 'bottom',
    },
    {
        target: '#tour-cart',
        title: 'Shopping Cart 🛒',
        content: 'Your cart shows item count here. Click to view cart contents and checkout.',
        placement: 'left',
    },
    {
        target: '#tour-chat',
        title: 'AI Assistant ✨',
        content: (
            <div>
                <p className="mb-2">This is your personal shopping concierge! Try asking:</p>
                <ul className="text-xs space-y-1 text-slate-500">
                    <li>• "Show me waterproof jackets under $200"</li>
                    <li>• "What's the best hiking boot?"</li>
                    <li>• "Rotate the 3D model to show the back"</li>
                </ul>
            </div>
        ),
        placement: 'left',
    },
];

// ========================================
// 🎯 Storage Key
// ========================================
const TOUR_STORAGE_KEY = 'trailmind-tour-completed';

// ========================================
// 🎨 Icons
// ========================================
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

// ========================================
// 🎓 Onboarding Tour Component
// ========================================
export default function OnboardingTour() {
    const [isRunning, setIsRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [mounted, setMounted] = useState(false);

    // Check if tour should run on mount
    useEffect(() => {
        setMounted(true);
        const hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY);
        if (!hasCompletedTour) {
            const timer = setTimeout(() => {
                setIsRunning(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Update target rect when step changes
    useEffect(() => {
        if (!isRunning) return;

        const step = TOUR_STEPS[currentStep];
        const element = document.querySelector(step.target);

        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);
        }
    }, [currentStep, isRunning]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!isRunning) return;
            const step = TOUR_STEPS[currentStep];
            const element = document.querySelector(step.target);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentStep, isRunning]);

    const handleNext = useCallback(() => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    }, [currentStep]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const handleSkip = useCallback(() => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        setIsRunning(false);
    }, []);

    const handleComplete = useCallback(() => {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        setIsRunning(false);
    }, []);

    if (!mounted || !isRunning || !targetRect) return null;

    const step = TOUR_STEPS[currentStep];
    const isLastStep = currentStep === TOUR_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    // Calculate tooltip position
    const getTooltipStyle = (): React.CSSProperties => {
        const padding = 12;
        const tooltipWidth = 320;

        switch (step.placement) {
            case 'bottom':
                return {
                    top: targetRect.bottom + padding,
                    left: Math.max(16, Math.min(targetRect.left, window.innerWidth - tooltipWidth - 16)),
                };
            case 'top':
                return {
                    bottom: window.innerHeight - targetRect.top + padding,
                    left: Math.max(16, Math.min(targetRect.left, window.innerWidth - tooltipWidth - 16)),
                };
            case 'left':
                return {
                    top: targetRect.top,
                    right: window.innerWidth - targetRect.left + padding,
                };
            case 'right':
                return {
                    top: targetRect.top,
                    left: targetRect.right + padding,
                };
            default:
                return {};
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay with spotlight */}
            <div className="absolute inset-0 bg-black/60" onClick={handleSkip}>
                {/* Spotlight cutout */}
                <div
                    className="absolute bg-transparent rounded-xl ring-4 ring-blue-400 ring-offset-4 ring-offset-transparent"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                    }}
                />
            </div>

            {/* Tooltip */}
            <div
                className="absolute bg-white rounded-2xl shadow-2xl p-5 w-80 animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={getTooltipStyle()}
            >
                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <CloseIcon />
                </button>

                {/* Progress */}
                <div className="flex gap-1 mb-3">
                    {TOUR_STEPS.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 flex-1 rounded-full transition-colors ${idx <= currentStep ? 'bg-blue-500' : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <div className="text-sm text-slate-600 mb-4">{step.content}</div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleSkip}
                        className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Skip tour
                    </button>

                    <div className="flex gap-2">
                        {!isFirstStep && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            {isLastStep ? 'Got it!' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
