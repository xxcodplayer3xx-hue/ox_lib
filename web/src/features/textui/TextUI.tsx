import { Box, createStyles, Group, Text } from '@mantine/core';
import React, { useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../components/LibIcon';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import ScaleFade from '../../transitions/ScaleFade';

interface TextUIData {
  text: string;
  position?: 'right-center' | 'left-center' | 'top-center' | 'bottom-center';
  icon?: string | IconProp;
  iconColor?: string;
  alignIcon?: 'top' | 'center';
  style?: React.CSSProperties;
}

const useStyles = createStyles((_, params: { position: TextUIData['position'] }) => ({
  wrapper: {
    position: 'absolute',
    zIndex: 1000,
    pointerEvents: 'none',
    ...({
      'right-center': { right: 32, top: '50%', transform: 'translateY(-50%)' },
      'left-center': { left: 32, top: '50%', transform: 'translateY(-50%)' },
      'top-center': { top: 32, left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: 54, left: '50%', transform: 'translateX(-50%)' },
    }[params.position || 'right-center']),
  },
  panel: {
    minWidth: 250,
    maxWidth: 420,
    padding: '10px 14px 10px 10px',
    border: '1px solid rgba(113, 237, 218, 0.35)',
    borderLeft: '3px solid #71edda',
    borderRadius: 7,
    background: 'linear-gradient(135deg, rgba(10, 20, 27, 0.96), rgba(15, 31, 39, 0.92))',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35), 0 0 22px rgba(113, 237, 218, 0.08)',
  },
  key: {
    minWidth: 32,
    height: 32,
    padding: '0 8px',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#081318',
    background: '#71edda',
    boxShadow: '0 0 18px rgba(113, 237, 218, 0.28)',
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  icon: {
    color: '#71edda',
    fontSize: 17,
  },
  text: {
    color: '#f1fbfa',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.2,
    lineHeight: 1.35,
  },
  hint: {
    color: '#79a09f',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
}));

const TextUI: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<TextUIData>({ text: '' });
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUIData>('textUi', (nextData) => {
    setData(nextData);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <Box className={classes.wrapper} style={typeof data.style === 'object' ? data.style : undefined}>
      <ScaleFade visible={visible}>
        <Box className={classes.panel}>
          <Group spacing={10} noWrap align={data.alignIcon === 'top' ? 'flex-start' : 'center'}>
            <Text className={classes.key}>E</Text>
            {data.icon && <LibIcon icon={data.icon as IconProp} className={classes.icon} fixedWidth />}
            <Box>
              <Text className={classes.hint}>Interaction available</Text>
              <Text className={classes.text}>{data.text}</Text>
            </Box>
          </Group>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default TextUI;
