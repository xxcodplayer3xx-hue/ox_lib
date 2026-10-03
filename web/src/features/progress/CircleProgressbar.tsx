import React from 'react';
import {createStyles, keyframes, RingProgress, Stack, Text, useMantineTheme} from '@mantine/core';
import {useNuiEvent} from '../../hooks/useNuiEvent';
import {fetchNui} from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type {CircleProgressbarProps} from '../../typings';

// 33.5 is the r of the circle
const progressCircle = keyframes({
  '0%': { strokeDasharray: `0, ${33.5 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${33.5 * 2 * Math.PI}, 0` },
});

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    '> svg > circle:nth-child(1)': {
      stroke: '#1b3437',
      strokeWidth: 7,
    },
    // Scuffed way of grabbing the first section and animating it
    '> svg > circle:nth-child(2)': {
      transition: 'none',
      animation: `${progressCircle} linear forwards`,
      animationDuration: `${params.duration}ms`,
      stroke: '#8fffe8',
      filter: 'drop-shadow(0 0 8px rgba(113, 237, 218, 0.48))',
    },
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Space Mono, monospace',
    textShadow: '0 0 14px rgba(113, 237, 218, 0.4)',
    color: '#f1fffc',
    fontWeight: 700,
  },
  label: {
    textAlign: 'center',
    textShadow: '0 0 12px rgba(113, 237, 218, 0.35)',
    color: '#b4d2ce',
    height: 25,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const theme = useMantineTheme();
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <Stack spacing={0} className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Stack spacing={0} align="center" className={classes.wrapper}>
            <RingProgress
              size={90}
              thickness={7}
              sections={[{ value: 0, color: theme.primaryColor }]}
              onAnimationEnd={() => setVisible(false)}
              className={classes.progress}
              label={<Text className={classes.value}>{value}%</Text>}
            />
            {label && <Text className={classes.label}>{label}</Text>}
          </Stack>
        </ScaleFade>
      </Stack>
    </>
  );
};

export default CircleProgressbar;
