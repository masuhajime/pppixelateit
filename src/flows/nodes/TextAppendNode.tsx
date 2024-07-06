/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { updateSetting } from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './TextAppendNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceText } from './items/HandleSourceText';
import { HandleTargetText } from './items/HandleTargetText';
import { Separator } from './items/Separator';

export function TextAppendNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="TextAppendNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetText
        name="Text"
        handleId={handleTargets.text.id}
        nodeId={id}
        value={data.settings.text || ''}
        onChange={updateSetting(id, 'text')}
      />
      <HandleTargetText
        name="Append text"
        handleId={handleTargets.append.id}
        nodeId={id}
        value={data.settings.append || ''}
        onChange={updateSetting(id, 'append')}
      />
      <HandleSourceText
        handleId={handleSources.text.id}
        label="Text"
        nodeId={id}
        propagateValue={data.result}
      />
      <Separator />
      <NodeStatus nodeData={data} />
    </NodeBasic>
  );
}
