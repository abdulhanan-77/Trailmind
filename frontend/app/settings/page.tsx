'use client';

import { useState } from 'react';

// ========================================
// ⚙️ Settings Page
// ========================================

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-600' : 'bg-slate-200'
            } relative`}
    >
        <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
        />
    </button>
);

interface SettingItem {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SettingItem[]>([
        { id: 'notifications', title: 'Push Notifications', description: 'Receive updates about your orders and recommendations.', enabled: true },
        { id: 'ai_suggestions', title: 'AI Suggestions', description: 'Allow the assistant to proactively suggest products.', enabled: true },
        { id: 'analytics', title: 'Share Analytics', description: 'Help us improve by sharing anonymized usage data.', enabled: false },
    ]);

    const toggleSetting = (id: string) => {
        setSettings(prev =>
            prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
        );
    };

    const handleRestartTour = () => {
        localStorage.removeItem('trailmind-tour-completed');
        window.location.reload();
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your preferences and account.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
                {settings.map((setting) => (
                    <div key={setting.id} className="p-5 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-800">{setting.title}</p>
                            <p className="text-sm text-slate-400 mt-0.5">{setting.description}</p>
                        </div>
                        <ToggleSwitch enabled={setting.enabled} onChange={() => toggleSetting(setting.id)} />
                    </div>
                ))}
            </div>

            {/* Tour Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Onboarding</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-700">Product Tour</p>
                        <p className="text-sm text-slate-400">Restart the guided tour to learn about AI features.</p>
                    </div>
                    <button
                        onClick={handleRestartTour}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                        Restart Tour
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Account</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-700">Guest User</p>
                        <p className="text-sm text-slate-400">guest@trailmind.com</p>
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:underline">
                        Sign In
                    </button>
                </div>
            </div>

            <div className="text-center pt-4">
                <p className="text-sm text-slate-400">Trailmind · v1.0.0</p>
                <p className="text-xs text-slate-300 mt-1">© 2026 Agentic Commerce Inc.</p>
            </div>
        </div>
    );
}
