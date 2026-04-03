import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeDefinition, VariableDefinition } from '../types/schema';

export const GenericNode = memo(({ data }: NodeProps<{ 
    definition: NodeDefinition; 
    parameters: Record<string, any>; 
    onChange: (params: Record<string, any>) => void;
    availableVariables: VariableDefinition[];
}>) => {
    const { definition, parameters, onChange, availableVariables } = data;

    const handleParamChange = (id: string, value: any) => {
        onChange({ ...parameters, [id]: value });
    };

    return (
        <div className="aura-node" style={{ borderColor: definition.color || '#555' }}>
            <div className="aura-node__header" style={{ backgroundColor: (definition.color || '#555') + '22' }}>
                <span className="aura-node__subtype">{definition.subtype}</span>
                <div className="aura-node__title">{definition.label}</div>
            </div>

            <div className="aura-node__body">
                <div className="aura-node__handles">
                    <div className="aura-node__column aura-node__column--inputs">
                        {definition.inputs.map((input) => (
                            <div key={input.id} className="aura-node__handle-wrapper">
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={input.id}
                                    className="aura-handle"
                                />
                                <span className="aura-handle-label">{input.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="aura-node__column aura-node__column--outputs">
                        {definition.outputs.map((output) => (
                            <div key={output.id} className="aura-node__handle-wrapper aura-node__handle-wrapper--right">
                                <span className="aura-handle-label">{output.label}</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={output.id}
                                    className="aura-handle"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {definition.parameters && definition.parameters.length > 0 && (
                    <div className="aura-node__content">
                        {definition.parameters.map((param) => (
                            <div key={param.id} className="aura-node__field">
                                <label>{param.label}</label>
                                {(param.type === 'string' || param.type === 'player') && (
                                    <input 
                                        type="text" 
                                        value={parameters[param.id] || ''} 
                                        onChange={(e) => handleParamChange(param.id, e.target.value)}
                                    />
                                )}
                                {param.type === 'number' && (
                                    <input 
                                        type="number" 
                                        value={parameters[param.id] || 0} 
                                        onChange={(e) => handleParamChange(param.id, parseFloat(e.target.value))}
                                    />
                                )}
                                {param.type === 'boolean' && (
                                    <input 
                                        type="checkbox" 
                                        checked={!!parameters[param.id]} 
                                        onChange={(e) => handleParamChange(param.id, e.target.checked)}
                                    />
                                )}
                                {param.type === 'enum' && param.options && (
                                    <select 
                                        value={parameters[param.id] || ''} 
                                        onChange={(e) => handleParamChange(param.id, e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        {param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                )}
                                {param.type === 'variable' && (
                                    <select 
                                        value={parameters[param.id] || ''} 
                                        onChange={(e) => handleParamChange(param.id, e.target.value)}
                                    >
                                        <option value="">Select Variable...</option>
                                        {availableVariables?.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                    </select>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});
