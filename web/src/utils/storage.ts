import { Node, Edge } from 'reactflow';
import { AuraSchema, AuraFlowNode, NodeType } from '../types/schema';

/**
 * Static JSON representing a sample flow in the new format.
 */
const STATIC_FLOW_DATA = JSON.stringify({
    types: {
        connection: [
            { id: 'message_flow', label: 'Message Flow', color: '#ffffff' },
            { id: 'string', label: 'String Value', color: '#ffcc00' },
            { id: 'player', label: 'Player', color: '#00ffcc' },
            { id: 'boolean', label: 'Boolean', color: '#ff4444' }
        ],
        node: [
            {
                id: 'chat_entry',
                type: NodeType.ENTRY,
                subtype: 'Chat',
                label: 'Player Chat',
                color: '#4CAF50',
                inputs: [],
                outputs: [
                    { id: 'flow', label: 'Next', connectionTypeId: 'message_flow' },
                    { id: 'msg', label: 'Message', connectionTypeId: 'string' },
                    { id: 'sender', label: 'Sender', connectionTypeId: 'player' }
                ],
                parameters: []
            },
            {
                id: 'filter_message',
                type: NodeType.PROCESSING,
                subtype: 'Routing',
                label: 'Filter Message',
                color: '#FF9800',
                inputs: [
                    { id: 'flow_in', label: 'Prev', connectionTypeId: 'message_flow' },
                    { id: 'text', label: 'Text', connectionTypeId: 'string' }
                ],
                outputs: [
                    { id: 'passed', label: 'Passed', connectionTypeId: 'message_flow' },
                    { id: 'failed', label: 'Failed', connectionTypeId: 'message_flow' },
                    { id: 'is_valid', label: 'Is Valid', connectionTypeId: 'boolean' }
                ],
                parameters: [
                    { id: 'regex', label: 'Regex', type: 'string' }
                ]
            },
            {
                id: 'set_recipient',
                type: NodeType.PROCESSING,
                subtype: 'Modification',
                label: 'Set Recipient',
                color: '#2196F3',
                inputs: [
                    { id: 'flow_in', label: 'Prev', connectionTypeId: 'message_flow' },
                    { id: 'player_in', label: 'Recipient', connectionTypeId: 'player' }
                ],
                outputs: [
                    { id: 'flow_out', label: 'Next', connectionTypeId: 'message_flow' }
                ],
                parameters: [
                    { id: 'scope', label: 'Scope', type: 'enum', options: ['GLOBAL', 'LOCAL', 'WORLD'] }
                ]
            },
            {
                id: 'send_to_recipients',
                type: NodeType.TERMINATION,
                subtype: 'Send',
                label: 'Send Message',
                color: '#F44336',
                inputs: [
                    { id: 'flow_in', label: 'Prev', connectionTypeId: 'message_flow' }
                ],
                outputs: [],
                parameters: []
            }
        ]
    },
    flow: {
        nodes: [
            {
                id: 'node_1',
                typeId: 'chat_entry',
                position: { x: 50, y: 150 },
                parameters: {},
                connections: {
                    'flow': ['node_2'],
                    'msg': ['node_2']
                }
            },
            {
                id: 'node_2',
                typeId: 'filter_message',
                position: { x: 400, y: 100 },
                parameters: { regex: '.*' },
                connections: {
                    'passed': ['node_3']
                }
            },
            {
                id: 'node_3',
                typeId: 'set_recipient',
                position: { x: 800, y: 150 },
                parameters: { scope: 'GLOBAL' },
                connections: {
                    'flow_out': ['node_4']
                }
            },
            {
                id: 'node_4',
                typeId: 'send_to_recipients',
                position: { x: 1150, y: 150 },
                parameters: {},
                connections: {}
            }
        ]
    }
} as AuraSchema);

export const loadFlow = (): AuraSchema => {
    try {
        return JSON.parse(STATIC_FLOW_DATA);
    } catch (error) {
        console.error('Failed to load flow data:', error);
        return {
            types: { connection: [], node: [] },
            flow: { nodes: [] }
        };
    }
};

export const saveFlow = (auraSchema: AuraSchema) => {
    const output = JSON.stringify(auraSchema, null, 2);
    
    console.log('--- GENERATED AURA FLOW OUTPUT ---');
    console.log(output);
    console.log('----------------------------------');
    
    alert('Flow saved to console log!');
};

/**
 * Helper to convert AuraSchema to ReactFlow format.
 */
export const auraToReactFlow = (schema: AuraSchema) => {
    const nodes: Node[] = schema.flow.nodes.map(node => {
        const definition = schema.types.node.find(n => n.id === node.typeId);
        return {
            id: node.id,
            type: 'generic',
            position: node.position,
            data: {
                definition,
                parameters: node.parameters,
                onChange: () => {}, // Added in App.tsx
                connectionTypes: schema.types.connection
            }
        };
    });

    const edges: Edge[] = [];
    schema.flow.nodes.forEach(sourceNode => {
        const sourceNodeDefinition = schema.types.node.find(n => n.id === sourceNode.typeId);
        
        Object.entries(sourceNode.connections).forEach(([outputId, targets]) => {
            const outputSocket = sourceNodeDefinition?.outputs.find(o => o.id === outputId);
            
            targets.forEach(targetId => {
                const targetNodeDef = schema.flow.nodes.find(n => n.id === targetId);
                const targetNodeDefinition = schema.types.node.find(n => n.id === targetNodeDef?.typeId);
                
                // Find matching input socket in target node
                const targetSocket = targetNodeDefinition?.inputs.find(i => i.connectionTypeId === outputSocket?.connectionTypeId);

                if (targetSocket) {
                    edges.push({
                        id: `e_${sourceNode.id}_${outputId}_${targetId}_${targetSocket.id}`,
                        source: sourceNode.id,
                        sourceHandle: outputId,
                        target: targetId,
                        targetHandle: targetSocket.id,
                    });
                }
            });
        });
    });

    return { nodes, edges };
};

/**
 * Helper to convert ReactFlow format to AuraSchema.
 */
export const reactFlowToAura = (nodes: Node[], edges: Edge[], types: AuraSchema['types']): AuraSchema => {
    const auraNodes: AuraFlowNode[] = nodes.map(node => {
        const connections: Record<string, string[]> = {};
        
        edges
            .filter(e => e.source === node.id)
            .forEach(e => {
                const handle = e.sourceHandle || 'default';
                if (!connections[handle]) connections[handle] = [];
                // Only add target once per output handle
                if (!connections[handle].includes(e.target)) {
                    connections[handle].push(e.target);
                }
            });

        return {
            id: node.id,
            typeId: node.data.definition.id,
            position: node.position,
            parameters: node.data.parameters,
            connections
        };
    });

    return {
        types,
        flow: { nodes: auraNodes }
    };
};
