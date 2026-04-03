import { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
    addEdge, 
    Background, 
    Controls, 
    Connection, 
    Edge, 
    Node, 
    applyNodeChanges, 
    applyEdgeChanges,
    NodeChange,
    EdgeChange,
    OnConnect,
    OnNodesChange,
    OnEdgesChange,
    IsValidConnection,
} from 'reactflow';

import { GenericNode } from './components/GenericNode';
import { NodeDefinition } from './types/schema';
import { loadFlow, saveFlow, auraToReactFlow, reactFlowToAura } from './utils/storage';
import './App.scss';

const nodeTypes = {
    generic: GenericNode,
};

const App: React.FC = () => {
    // Load initial data from storage
    const initialSchema = useMemo(() => loadFlow(), []);
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => auraToReactFlow(initialSchema), [initialSchema]);

    const updateNodeData = useCallback((nodeId: string, newParams: Record<string, any>) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === nodeId) {
                return { ...node, data: { ...node.data, parameters: newParams } };
            }
            return node;
        }));
    }, []);

    const [nodes, setNodes] = useState<Node[]>(
        initialNodes.map(node => ({
            ...node,
            data: { 
                ...node.data, 
                onChange: (newParams: any) => updateNodeData(node.id, newParams) 
            }
        }))
    );
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect: OnConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const isValidConnection: IsValidConnection = useCallback((connection) => {
        const sourceNode = nodes.find((n) => n.id === connection.source);
        const targetNode = nodes.find((n) => n.id === connection.target);

        if (!sourceNode || !targetNode) return false;

        const sourceOutput = sourceNode.data.definition.outputs.find((o: any) => o.id === connection.sourceHandle);
        const targetInput = targetNode.data.definition.inputs.find((i: any) => i.id === connection.targetHandle);

        return sourceOutput?.connectionTypeId === targetInput?.connectionTypeId;
    }, [nodes]);

    const onDragStart = (event: React.DragEvent, nodeDef: NodeDefinition) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDef));
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = document.querySelector('.aura-canvas')?.getBoundingClientRect();
            const dataStr = event.dataTransfer.getData('application/reactflow');

            if (!dataStr || !reactFlowBounds) return;

            const definition: NodeDefinition = JSON.parse(dataStr);

            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            };

            const nodeId = `${definition.id}_${Date.now()}`;
            const newNode: Node = {
                id: nodeId,
                type: 'generic',
                position,
                data: { 
                    definition, 
                    parameters: {},
                    connectionTypes: initialSchema.types.connection,
                    onChange: (newParams: Record<string, any>) => updateNodeData(nodeId, newParams)
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes, updateNodeData, initialSchema.types.connection]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleSave = () => {
        const schema = reactFlowToAura(nodes, edges, initialSchema.types);
        saveFlow(schema);
    };

    return (
        <div className="aura-app">
            <aside className="aura-sidebar">
                <div className="aura-sidebar__header">AuraChat Editor</div>
                <div className="aura-sidebar__toolbar">
                    <button onClick={handleSave} className="aura-btn aura-btn--primary">Save Flow</button>
                </div>
                <div className="aura-sidebar__section">
                    <div className="aura-sidebar__label">Available Nodes</div>
                    {initialSchema.types.node.map((nodeDef) => (
                        <div 
                            key={nodeDef.id} 
                            className="aura-node-item"
                            onDragStart={(event) => onDragStart(event, nodeDef)}
                            draggable
                            style={{ borderLeftColor: nodeDef.color }}
                        >
                            <span className="aura-node-item__type">{nodeDef.subtype}</span>
                            {nodeDef.label}
                        </div>
                    ))}
                </div>
            </aside>
            <main className="aura-canvas" onDrop={onDrop} onDragOver={onDragOver}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    isValidConnection={isValidConnection}
                    fitView
                >
                    <Background color="#333" gap={20} />
                    <Controls />
                </ReactFlow>
            </main>
        </div>
    );
};

export default App;
