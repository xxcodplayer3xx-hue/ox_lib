import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    position: 'relative',
    width: 410,
    height: 54,
    border: '1px solid rgba(177, 255, 239, 0.18)',
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(15, 27, 31, 0.98), rgba(7, 16, 20, 0.98))',
    overflow: 'hidden',
    boxShadow: '0 18px 42px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(0, 0, 0, 0.2)',
  },
  wrapper: {
    width: '100%',
    height: '24%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, #61d9c4, #a9ffe9)',
    boxShadow: '0 0 24px rgba(113, 237, 218, 0.34)',
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    width: 410,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    maxWidth: 350,
    padding: 8,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.85,
    textTransform: 'uppercase',
    color: '#e7faf7',
    textShadow: theme.shadows.sm,
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
              }}
            >
              <Box className={classes.labelWrapper}>
                <Text className={classes.label}>{label}</Text>
              </Box>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;
