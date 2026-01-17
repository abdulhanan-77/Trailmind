/**
 * Agent Command Types for 3D Viewer Control
 * Used for Agent-Synchronized Camera functionality
 */

export type AgentActionType =
    | 'ROTATE_MODEL'
    | 'ZOOM_MODEL'
    | 'RESET_VIEW'
    | 'HIGHLIGHT_FEATURE';

export interface AgentCommand {
    action: AgentActionType;
    coordinates?: { x: number; y: number; z: number };
    zoomLevel?: number;
    featureId?: string;
    message?: string;
}

// Event name for cross-component communication
export const AGENT_COMMAND_EVENT = 'agent:model:command';

// Helper to dispatch agent commands
export function dispatchAgentCommand(command: AgentCommand): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent(AGENT_COMMAND_EVENT, { detail: command })
        );
    }
}
