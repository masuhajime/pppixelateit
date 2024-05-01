/* eslint-disable react/require-default-props */
// @flow
import ImageIcon from '@mui/icons-material/Image';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from '@mui/icons-material/Save';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge';
import PhotoSizeSelectSmallIcon from '@mui/icons-material/PhotoSizeSelectSmall';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import OpacityIcon from '@mui/icons-material/Opacity';
import PaletteIcon from '@mui/icons-material/Palette';
import LayersIcon from '@mui/icons-material/Layers';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import PinIcon from '@mui/icons-material/Pin';
import React from 'react';

type Props = {
  icon?: string;
  style?: React.CSSProperties;
};
export default function TextToIcon(props: Props) {
  const { icon, style } = props;
  switch (icon) {
    case 'ImageIcon':
      return <ImageIcon style={style} />;
    case 'FolderIcon':
      return <FolderIcon style={style} />;
    case 'SaveIcon':
      return <SaveIcon style={style} />;
    case 'AutoFixHighIcon':
      return <AutoFixHighIcon style={style} />;
    case 'FormatColorFillIcon':
      return <FormatColorFillIcon style={style} />;
    case 'PhotoSizeSelectLargeIcon':
      return <PhotoSizeSelectLargeIcon style={style} />;
    case 'PhotoSizeSelectSmallIcon':
      return <PhotoSizeSelectSmallIcon style={style} />;
    case 'VisibilityIcon':
      return <VisibilityIcon style={style} />;
    case 'TextFieldsIcon':
      return <TextFieldsIcon style={style} />;
    case 'PaletteIcon':
      return <PaletteIcon style={style} />;
    case 'BorderOuterIcon':
      return <BorderOuterIcon style={style} />;
    case 'OpacityIcon':
      return <OpacityIcon style={style} />;
    case 'LayersIcon':
      return <LayersIcon style={style} />;
    case 'PinIcon':
      return <PinIcon style={style} />;
    default:
      return <CheckBoxOutlineBlankIcon style={style} />;
  }
}
