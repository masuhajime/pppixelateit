/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import { NodeData, handleSources, handleTargets } from './KmeansNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { HandleTargetNumber } from './items/HandleTargetNumber';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';
import { Select } from './items/Select';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Typography,
} from '@mui/material';
import { SliderValue } from './items/SliderValue';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
  DitheringMatrix2_2StrengthMarks,
  DitheringMatrix4_4StrengthMarks,
} from '../../main/process/imageKmeansMatrix';

export function KmeansNode({ id, data, selected }: NodeProps<NodeData>) {
  const displayDitheringStrength = data.settings.ditheringMatrix !== 'none';
  const ditheringStrengthMarks =
    data.settings.ditheringMatrix === 'matrix2'
      ? DitheringMatrix2_2StrengthMarks
      : DitheringMatrix4_4StrengthMarks;
  return (
    <NodeBasic
      id={id}
      nodeName="KmeansNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
      <Separator />
      <HandleSourceImage
        label="Image"
        handleId={handleSources.image.id}
        nodeId={id}
      />
      <HandleTargetNumber
        name="Clustering Colors"
        handleId={handleTargets.number.id}
        nodeId={id}
        max={128}
        min={1}
        number={data.settings.number || 8}
        disableHandle
        onChange={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            number: value,
          });
        }}
      />
      {(data.settings.number || 1) > 32 && (
        <Box sx={{ color: 'red', px: 2 }}>
          <Typography variant="body2">
            Warning: High number of colors may result in slow processing
          </Typography>
        </Box>
      )}
      <Select
        label="Dithering Matrix"
        nodeId={id}
        defaultValue={data.settings.ditheringMatrix || 'none'}
        onSelect={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            ditheringMatrix: value,
          });
        }}
      >
        <MenuItem value="none">None</MenuItem>
        <MenuItem value="matrix2">Matrix 2x2</MenuItem>
        <MenuItem value="matrix4">Matrix 4x4</MenuItem>
      </Select>
      <Box sx={{ display: displayDitheringStrength ? 'block' : 'none' }}>
        <SliderValue
          label="Dithering Strength"
          onSelect={(v) => {
            useNodeStore.getState().updateNodeSetting(id, {
              ditheringStrength: v,
            });
          }}
          max={ditheringStrengthMarks.map((m) => m.value).slice(-1)[0]}
          value={data.settings.ditheringStrength || 4}
          marks={ditheringStrengthMarks}
        />
      </Box>
      <Accordion
        elevation={0}
        sx={{
          '&:before': { height: '0px' },
          backgroundColor: 'transparent',
        }}
      >
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="advanced-option-content"
          id="advanced-option-header"
          className="nodrag"
        >
          <Typography>Advanced Option</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            flexDirection: 'column',
            padding: 0,
          }}
        >
          <HandleTargetNumber
            name="Kmeans Seed"
            handleId={handleTargets.number.id}
            nodeId={id}
            max={9999}
            min={0}
            number={data.settings.seed || 0}
            disableHandle
            onChange={(value) => {
              useNodeStore.getState().updateNodeSetting(id, {
                seed: value,
              });
            }}
          />
          <Box sx={{ color: 'gray', px: 2 }}>
            <Typography variant="body2">0 = Random seed</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <NodeStatus nodeData={data} />
      <ImagePreview
        enabled={data.settings.enablePreview}
        completed={!!data.completed}
        imageBuffer={data.imageBuffer?.buffer}
        onTogglePreview={(enabled: boolean) => {
          useNodeStore.getState().updateNodeSetting(id, {
            enablePreview: enabled,
          });
        }}
      />
    </NodeBasic>
  );
}
