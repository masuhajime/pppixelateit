/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  ReactCompareSlider,
  ReactCompareSliderHandle,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import imageBase64TransparentBackground from '../../assets/transparent-background';
import { arrayBufferToBase64 } from '../../process/w2b';
import { NodeData, handleTargets } from './ImagePreviewCompareBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleTargetImage } from './items/HandleTargetImage';
import { Separator } from './items/Separator';

export function ImagePreviewCompare({
  id,
  data,
  selected,
}: NodeProps<NodeData>) {
  const [htmlImageBase64A, setHtmlImageBase64A] = useState<
    string | undefined
  >();
  const [htmlImageBase64B, setHtmlImageBase64B] = useState<
    string | undefined
  >();
  useEffect(() => {
    if (!data.imageBufferA) {
      setHtmlImageBase64A(undefined);
    }
    if (data.imageBufferA?.buffer) {
      setHtmlImageBase64A(
        `data:image/png;base64,${arrayBufferToBase64(
          data.imageBufferA.buffer,
        )}`,
      );
    }
  }, [data.imageBufferA]);
  useEffect(() => {
    if (!data.imageBufferB) {
      setHtmlImageBase64B(undefined);
    }
    if (data.imageBufferB?.buffer) {
      setHtmlImageBase64B(
        `data:image/png;base64,${arrayBufferToBase64(
          data.imageBufferB.buffer,
        )}`,
      );
    }
  }, [data.imageBufferB]);

  return (
    <NodeBasic
      id={id}
      nodeName="ImagePreviewCompare"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetImage handleId={handleTargets.imageA.id} nodeId={id} />
      <HandleTargetImage handleId={handleTargets.imageB.id} nodeId={id} />
      <Separator />
      <NodeStatus nodeData={data} />
      {/* </NodeContent> */}

      {!!htmlImageBase64A && !!htmlImageBase64B && (
        <Box
          className="nodrag"
          sx={{
            backgroundColor: 'white',
          }}
        >
          <ReactCompareSlider
            handle={
              <ReactCompareSliderHandle
                portrait={false}
                buttonStyle={{
                  backdropFilter: undefined,
                  WebkitBackdropFilter: undefined,
                  backgroundColor: 'white',
                  color: '#666',
                  boxShadow: undefined,
                  border: 0,
                  opacity: 0.9,
                }}
                linesStyle={{
                  opacity: 0.5,
                }}
              />
            }
            itemOne={
              <ReactCompareSliderImage
                style={{
                  imageRendering: 'pixelated',
                  backgroundImage: `url(${imageBase64TransparentBackground})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'repeat',
                }}
                src={htmlImageBase64A}
                alt="Image one"
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                style={{
                  imageRendering: 'pixelated',
                  backgroundImage: `url(${imageBase64TransparentBackground})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'repeat',
                }}
                src={htmlImageBase64B}
                alt="Image two"
              />
            }
          />
        </Box>
      )}
    </NodeBasic>
  );
}
