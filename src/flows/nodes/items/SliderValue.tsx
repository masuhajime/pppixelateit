import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Typography } from '@mui/material';

type Props = {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  onSelect: (value: number) => void;
  marks?: Array<{ value: number; label: string }>;
};

export function SliderValue(props: Props) {
  const { label, value, onSelect, max, min } = props;
  return (
    <Box className="node-item nodrag">
      <Typography>{label}</Typography>
      <Slider
        aria-label="Small"
        valueLabelDisplay="on"
        value={Number.isInteger(value) ? value : 50}
        min={min}
        max={max}
        onChange={(event: Event, newValue: number | number[]) => {
          onSelect(newValue as number);
        }}
        marks={props.marks}
        step={!!props.marks ? null : 1}
      />
    </Box>
  );
}
