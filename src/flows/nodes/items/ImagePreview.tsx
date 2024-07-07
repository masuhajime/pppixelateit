/* eslint-disable import/prefer-default-export */
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { arrayBufferToBase64 } from '../../../process/w2b';
import imageBase64TransparentBackground from '../../../assets/transparent-background';
import useSnackbar from '../../../store/snackbarStore';

type Props = {
  enabled?: boolean;
  completed?: boolean;
  imageBase64?: string | undefined;
  imageBuffer?: Buffer | undefined;
  onTogglePreview?: (enabled: boolean) => void;
};
export function ImagePreview({
  enabled = true,
  completed = false,
  imageBase64,
  imageBuffer,
  onTogglePreview,
}: Props) {
  const [size, setSize] = useState<
    | {
        x: number;
        y: number;
      }
    | undefined
  >(undefined);
  const [htmlImageBase64, setHtmlImageBase64] = useState<string | undefined>();
  useEffect(() => {
    if (!imageBuffer) {
      setHtmlImageBase64(undefined);
    }
    // return した方が処理が減るが, 画像のsizeが計算できなくなる
    // if (!enabled) {
    //   return;
    // }
    if (!completed) {
      setHtmlImageBase64(undefined);
      return;
    }

    if (imageBase64) {
      setHtmlImageBase64(imageBase64);
    }
    if (imageBuffer) {
      setHtmlImageBase64(
        `data:image/png;base64,${arrayBufferToBase64(imageBuffer)}`,
      );
    }
  }, [imageBuffer, imageBase64, enabled, completed]);

  useEffect(() => {
    if (!htmlImageBase64) {
      setSize(undefined);
      return;
    }
    const image = new Image();
    image.src = htmlImageBase64;
    image.onload = () => {
      setSize({
        x: image.width,
        y: image.height,
      });
    };
  }, [htmlImageBase64]);

  // clipboard.writeImage(nativeImage.createFromDataURL(htmlImageBase64 || ''));

  return (
    <Box
      className="node-item"
      // sx={{
      //   display: 'flex',
      //   alignItems: 'center',
      // }}
    >
      {togglePreview(
        enabled,
        onTogglePreview,
        () => {
          if (imageBuffer) {
            const blob = new Blob([imageBuffer], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'image.png';
            a.click();
          }
        },
        () => {
          if (imageBuffer) {
            console.log('copying image to clipboard');
            window.clipboard.writeImage(imageBuffer);
          }
        },
        size,
        completed,
      )}
      {enabled && !completed && (
        <Typography variant="caption" color="text.disabled">
          waiting
        </Typography>
      )}
      {enabled && completed && (
        <>
          {!!imageBase64 && (
            <div
              style={{
                backgroundImage: `url(${imageBase64TransparentBackground})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat',
                lineHeight: 0,
              }}
            >
              <img
                src={imageBase64}
                style={{
                  // width: '100%',
                  maxWidth: '208px',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
                alt="preview"
              />
            </div>
          )}
          {!!imageBuffer && (
            <div
              style={{
                backgroundImage: `url(${imageBase64TransparentBackground})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'repeat',
                lineHeight: 0,
              }}
            >
              <img
                src={htmlImageBase64}
                style={{
                  // width: '100%',
                  maxWidth: '208px',
                  height: 'auto',
                  imageRendering: 'pixelated',
                }}
                alt="preview"
              />
            </div>
          )}
        </>
      )}
    </Box>
  );
}

const togglePreview = (
  enabled: boolean,
  onTogglePreview?: (enabled: boolean) => void,
  onImageSave?: () => void,
  onImageClipboard?: () => void,
  size?: {
    x: number;
    y: number;
  },
  completed?: boolean,
) => {
  const { addSnackBar } = useSnackbar();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '0.2em',
      }}
    >
      {enabled && (
        <VisibilityIcon
          className="nodrag"
          sx={{
            fontSize: '1.2em',
            color: 'primary.main',
            cursor: 'pointer',
            paddingRight: '0.2em',
          }}
          onClick={() => {
            !!onTogglePreview && onTogglePreview(!enabled);
          }}
        />
      )}
      {!enabled && (
        <VisibilityOffIcon
          className="nodrag"
          sx={{
            fontSize: '1.2em',
            color: 'text.disabled',
            cursor: 'pointer',
            paddingRight: '0.2em',
            '&:hover': {
              color: 'primary.main',
            },
          }}
          onClick={() => {
            !!onTogglePreview && onTogglePreview(!enabled);
          }}
        />
      )}
      {!!size && (
        <Box
          sx={{
            display: 'inline-block',
            fontSize: '0.8em',
            color: 'text.disabled',
          }}
        >
          {size.x}x{size.y}
        </Box>
      )}
      {completed && (
        <>
          <DownloadIcon
            className="nodrag"
            sx={{
              fontSize: '1.2em',
              color: 'text.disabled',
              cursor: 'pointer',
              paddingLeft: '0.2em',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={() => {
              !!onImageSave && onImageSave();
            }}
          />
          <ContentPasteIcon
            // copy image to clipboard
            className="nodrag"
            sx={{
              fontSize: '1.2em',
              color: 'text.disabled',
              cursor: 'pointer',
              paddingLeft: '0.2em',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={() => {
              !!onImageClipboard && onImageClipboard();
              addSnackBar('Image copied to clipboard');
            }}
          />
        </>
      )}
    </Box>
  );
};
