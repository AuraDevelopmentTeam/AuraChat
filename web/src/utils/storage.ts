import { Node, Edge } from 'reactflow';
import { AuraSchema, AuraFlowNode, NodeType } from '../types/schema';

/**
 * Static JSON representing the example flow from README.md.
 */
const STATIC_FLOW_DATA = JSON.stringify({
    types: {
        node: [
            // Entry Nodes
            {
                id: 'chat_entry',
                type: NodeType.ENTRY,
                subtype: 'Chat',
                label: 'Message',
                color: '#4CAF50',
                inputs: [],
                outputs: [{ id: 'out', label: 'Flow' }],
                parameters: []
            },
            {
                id: 'command_local',
                type: NodeType.ENTRY,
                subtype: 'Command',
                label: 'Command: /local [message...]',
                color: '#4CAF50',
                inputs: [],
                outputs: [{ id: 'out', label: 'Flow' }],
                parameters: []
            },
            {
                id: 'command_global',
                type: NodeType.ENTRY,
                subtype: 'Command',
                label: 'Command: /global [message...]',
                color: '#4CAF50',
                inputs: [],
                outputs: [{ id: 'out', label: 'Flow' }],
                parameters: []
            },
            {
                id: 'command_msg',
                type: NodeType.ENTRY,
                subtype: 'Command',
                label: 'Command: /msg <player> <message...>',
                color: '#4CAF50',
                inputs: [],
                outputs: [{ id: 'out', label: 'Flow' }],
                parameters: []
            },
            {
                id: 'command_r',
                type: NodeType.ENTRY,
                subtype: 'Command',
                label: 'Command: /r <message...>',
                color: '#4CAF50',
                inputs: [],
                outputs: [{ id: 'out', label: 'Flow' }],
                parameters: []
            },
            // Processing Nodes
            {
                id: 'channel_check',
                type: NodeType.PROCESSING,
                subtype: 'Routing',
                label: 'Channel Check ($channel)',
                color: '#FF9800',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [
                    { id: 'local', label: 'local' },
                    { id: 'global', label: 'global' }
                ],
                parameters: []
            },
            {
                id: 'send_local_proc',
                type: NodeType.PROCESSING,
                subtype: 'Modification',
                label: 'Set Recipients (Local)',
                color: '#2196F3',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: []
            },
            {
                id: 'send_global_proc',
                type: NodeType.PROCESSING,
                subtype: 'Modification',
                label: 'Set Recipients (Global)',
                color: '#2196F3',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: []
            },
            {
                id: 'message_empty_local',
                type: NodeType.PROCESSING,
                subtype: 'Routing',
                label: 'Message Empty? (Local)',
                color: '#FF9800',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No' }
                ],
                parameters: []
            },
            {
                id: 'message_empty_global',
                type: NodeType.PROCESSING,
                subtype: 'Routing',
                label: 'Message Empty? (Global)',
                color: '#FF9800',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No' }
                ],
                parameters: []
            },
            {
                id: 'set_local',
                type: NodeType.PROCESSING,
                subtype: 'Variable',
                label: 'Set Channel: local',
                color: '#9C27B0',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: [
                    { id: 'variable', label: 'Variable', type: 'variable' },
                    { id: 'value', label: 'Value', type: 'string' }
                ]
            },
            {
                id: 'set_global',
                type: NodeType.PROCESSING,
                subtype: 'Variable',
                label: 'Set Channel: global',
                color: '#9C27B0',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: [
                    { id: 'variable', label: 'Variable', type: 'variable' },
                    { id: 'value', label: 'Value', type: 'string' }
                ]
            },
            {
                id: 'set_last_player',
                type: NodeType.PROCESSING,
                subtype: 'Variable',
                label: 'Set last_msg_player',
                color: '#9C27B0',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: []
            },
            {
                id: 'set_last_player_reverse',
                type: NodeType.PROCESSING,
                subtype: 'Variable',
                label: 'Set last_msg_player (Reverse)',
                color: '#9C27B0',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: []
            },
            {
                id: 'set_recipients',
                type: NodeType.PROCESSING,
                subtype: 'Modification',
                label: 'Set Recipients (last_msg_player)',
                color: '#2196F3',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [{ id: 'out', label: 'Out' }],
                parameters: []
            },
            {
                id: 'check_last_msg_player',
                type: NodeType.PROCESSING,
                subtype: 'Routing',
                label: 'Has last_msg_player?',
                color: '#FF9800',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No' }
                ],
                parameters: []
            },
            // Termination Nodes
            {
                id: 'submit_message',
                type: NodeType.TERMINATION,
                subtype: 'Submit',
                label: 'Submit Message',
                color: '#F44336',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [],
                parameters: []
            },
            {
                id: 'send_message_node',
                type: NodeType.TERMINATION,
                subtype: 'Send',
                label: 'Send Message (Notification)',
                color: '#F44336',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [],
                parameters: [
                    { id: 'message', label: 'Message', type: 'string' }
                ]
            },
            {
                id: 'no_player_error',
                type: NodeType.TERMINATION,
                subtype: 'Error',
                label: 'Error: No player to reply',
                color: '#F44336',
                inputs: [{ id: 'in', label: 'In' }],
                outputs: [],
                parameters: []
            }
        ]
    },
    variables: [
        {
            id: 'channel',
            name: 'channel',
            variant: 'player',
            scope: 'global',
            persistence: 'persistent',
            type: 'enum',
            options: ['global', 'local'],
            defaultValue: 'local'
        },
        {
            id: 'last_msg_player',
            name: 'last_msg_player',
            variant: 'player',
            scope: 'global',
            persistence: 'persistent',
            type: 'player',
            defaultValue: null
        }
    ],
    flow: {
        nodes: [
            { id: 'entry_msg', typeId: 'chat_entry', position: { x: 50, y: 50 }, parameters: {}, connections: { 'out': ['node_channel_check'] } },
            { id: 'node_channel_check', typeId: 'channel_check', position: { x: 300, y: 50 }, parameters: {}, connections: { 'local': ['node_send_local'], 'global': ['node_send_global'] } },
            { id: 'node_send_local', typeId: 'send_local_proc', position: { x: 550, y: 20 }, parameters: {}, connections: { 'out': ['node_submit'] } },
            { id: 'node_send_global', typeId: 'send_global_proc', position: { x: 550, y: 100 }, parameters: {}, connections: { 'out': ['node_submit'] } },
            { id: 'node_submit', typeId: 'submit_message', position: { x: 850, y: 50 }, parameters: {}, connections: {} },

            { id: 'entry_local', typeId: 'command_local', position: { x: 50, y: 200 }, parameters: {}, connections: { 'out': ['node_empty_local'] } },
            { id: 'node_empty_local', typeId: 'message_empty_local', position: { x: 300, y: 200 }, parameters: {}, connections: { 'yes': ['node_set_local'], 'no': ['node_send_local'] } },
            { id: 'node_set_local', typeId: 'set_local', position: { x: 550, y: 200 }, parameters: { variable: 'channel', value: 'local' }, connections: { 'out': ['node_notify_channel'] } },
            { id: 'node_notify_channel', typeId: 'send_message_node', position: { x: 850, y: 200 }, parameters: { message: 'Successfully changed channel to local' }, connections: {} },

            { id: 'entry_global', typeId: 'command_global', position: { x: 50, y: 350 }, parameters: {}, connections: { 'out': ['node_empty_global'] } },
            { id: 'node_empty_global', typeId: 'message_empty_global', position: { x: 300, y: 350 }, parameters: {}, connections: { 'yes': ['node_set_global'], 'no': ['node_send_global'] } },
            { id: 'node_set_global', typeId: 'set_global', position: { x: 550, y: 350 }, parameters: { variable: 'channel', value: 'global' }, connections: { 'out': ['node_notify_channel_global'] } },
            { id: 'node_notify_channel_global', typeId: 'send_message_node', position: { x: 850, y: 350 }, parameters: { message: 'Successfully changed channel to global' }, connections: {} },

            { id: 'entry_msg_cmd', typeId: 'command_msg', position: { x: 50, y: 500 }, parameters: {}, connections: { 'out': ['node_set_last'] } },
            { id: 'node_set_last', typeId: 'set_last_player', position: { x: 300, y: 500 }, parameters: {}, connections: { 'out': ['node_set_last_rev'] } },
            { id: 'node_set_last_rev', typeId: 'set_last_player_reverse', position: { x: 550, y: 500 }, parameters: {}, connections: { 'out': ['node_set_recipients'] } },
            { id: 'node_set_recipients', typeId: 'set_recipients', position: { x: 800, y: 500 }, parameters: {}, connections: { 'out': ['node_submit'] } },

            { id: 'entry_r', typeId: 'command_r', position: { x: 50, y: 650 }, parameters: {}, connections: { 'out': ['node_check_last'] } },
            { id: 'node_check_last', typeId: 'check_last_msg_player', position: { x: 300, y: 650 }, parameters: {}, connections: { 'yes': ['node_set_last_rev'], 'no': ['node_error_no_player'] } },
            { id: 'node_error_no_player', typeId: 'no_player_error', position: { x: 550, y: 700 }, parameters: {}, connections: {} }
        ]
    }
});

export function loadFlow(): AuraSchema {
    const saved = localStorage.getItem('aura_flow');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved flow, falling back to static data', e);
        }
    }
    return JSON.parse(STATIC_FLOW_DATA);
}

export function saveFlow(auraSchema: AuraSchema) {
    const data = JSON.stringify(auraSchema, null, 2);
    localStorage.setItem('aura_flow', data);
    console.log('Saved AuraChat Flow:', data);
}

/**
 * Maps AuraSchema to React Flow state
 */
export function auraToReactFlow(schema: AuraSchema): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = schema.flow.nodes.map(node => {
        const definition = schema.types.node.find(n => n.id === node.typeId);
        if (!definition) {
            console.warn(`Definition not found for typeId: ${node.typeId}`);
        }
        return {
            id: node.id,
            type: 'generic',
            position: node.position,
            data: {
                definition: definition || {
                    id: node.typeId,
                    type: NodeType.PROCESSING,
                    subtype: 'Unknown',
                    label: node.typeId,
                    inputs: [],
                    outputs: []
                },
                parameters: node.parameters,
                onChange: () => { } // Will be wired up in App.tsx
            }
        };
    });

    const edges: Edge[] = [];
    schema.flow.nodes.forEach(sourceNode => {
        const definition = schema.types.node.find(n => n.id === sourceNode.typeId);
        if (!definition) return;

        Object.entries(sourceNode.connections).forEach(([outputId, targets]) => {
            targets.forEach(targetId => {
                edges.push({
                    id: `e-${sourceNode.id}-${outputId}-${targetId}`,
                    source: sourceNode.id,
                    sourceHandle: outputId,
                    target: targetId,
                    targetHandle: 'in' // Default input handle
                });
            });
        });
    });

    return { nodes, edges };
}

/**
 * Maps React Flow state back to AuraSchema
 */
export function reactFlowToAura(nodes: Node[], edges: Edge[], types: AuraSchema['types'], variables: AuraSchema['variables']): AuraSchema {
    const auraNodes: AuraFlowNode[] = nodes.map(node => {
        const connections: Record<string, string[]> = {};

        edges.filter(e => e.source === node.id).forEach(e => {
            const sourceHandle = e.sourceHandle || 'out';
            if (!connections[sourceHandle]) {
                connections[sourceHandle] = [];
            }
            if (!connections[sourceHandle].includes(e.target)) {
                connections[sourceHandle].push(e.target);
            }
        });

        return {
            id: node.id,
            typeId: node.data.definition.id,
            position: node.position,
            parameters: node.data.parameters || {},
            connections
        };
    });

    return {
        types,
        variables,
        flow: {
            nodes: auraNodes
        }
    };
}
