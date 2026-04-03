export enum NodeType {
    ENTRY = 'ENTRY',
    PROCESSING = 'PROCESSING',
    TERMINATION = 'TERMINATION'
}

export interface NodeSocket {
    id: string;
    label: string;
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
    defaultValue?: any;
}

export interface VariableDefinition {
    id: string;
    name: string;
    variant: 'global' | 'player';
    scope: 'global' | 'per_world_server';
    persistence: 'persistent' | 'volatile';
    type: 'string' | 'text_component' | 'number' | 'enum' | 'player' | 'boolean';
    options?: string[]; // For enums
    defaultValue?: any;
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
        node: NodeDefinition[];
    };
    variables: VariableDefinition[];
    flow: {
        nodes: AuraFlowNode[];
    };
}
