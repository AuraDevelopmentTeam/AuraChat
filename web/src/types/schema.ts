export enum NodeType {
    ENTRY = 'ENTRY',
    PROCESSING = 'PROCESSING',
    TERMINATION = 'TERMINATION'
}

export interface ConnectionType {
    id: string;
    label: string;
    color: string;
}

export interface NodeSocket {
    id: string;
    label: string;
    connectionTypeId: string;
}

export interface NodeDefinition {
    id: string;
    type: NodeType;
    subtype: string;
    label: string;
    color?: string;
    description?: string;
    inputs: NodeSocket[];
    outputs: NodeSocket[];
    parameters?: ParameterDefinition[];
}

export interface ParameterDefinition {
    id: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'enum' | 'player' | 'variable';
    options?: string[]; // For enums
}

export interface AuraFlowNode {
    id: string;
    typeId: string;
    position: { x: number; y: number };
    parameters: Record<string, any>;
    connections: Record<string, string[]>; // outputId -> targetNodeIds
}

export interface AuraSchema {
    types: {
        connection: ConnectionType[];
        node: NodeDefinition[];
    };
    flow: {
        nodes: AuraFlowNode[];
    };
}
