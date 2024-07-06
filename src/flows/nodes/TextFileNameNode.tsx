/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import {
  NodeData,
  handleSources,
  handleTargets,
} from './TextFileNameNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceText } from './items/HandleSourceText';
import { HandleTargetText } from './items/HandleTargetText';

export function TextFileNameNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="TextFileNameNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetText
        name="Text Input"
        handleId={handleTargets.text.id}
        nodeId={id}
        value={data.settings.text || ''}
        disableInput
      />
      <HandleSourceText
        handleId={handleSources.text.id}
        label="Text"
        nodeId={id}
        propagateValue={data.result}
      />
      <NodeStatus nodeData={data} />
    </NodeBasic>
  );
}
