/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import {
  NodeData,
  handleSources,
  handleTargets,
} from './TextFileNameNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceText } from './items/HandleSourceText';
import { HandleTargetText } from './items/HandleTargetText';

export function TextFileNameNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="File Name" />
      <NodeContent>
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
      </NodeContent>
    </Node>
  );
}
