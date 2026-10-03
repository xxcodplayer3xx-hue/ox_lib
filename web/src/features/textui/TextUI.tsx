import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box, createStyles, Group, Text } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import LibIcon from '../../components/LibIcon';

interface TextUIData {
  text: string;
  position?: 'right-center' | 'left-center' | 'top-center' | 'bottom-center';
  icon?: IconProp | string | [IconProp | string, string];
  iconColor?: string;
  style?: React.CSSProperties;
  alignIcon?: 'top' | 'center';
}

const useStyles = createStyles((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 1000,
    pointerEvents: 'none',
    transition: 'opacity 180ms ease, transform 180ms ease',
  },
  rightCenter: {
    top: '50%',
    right: '3.5%',
    transform: 'translateY(-50%)',
  },
  leftCenter: {
    top: '50%',
    left: '3.5%',
    transform: 'translateY(-50%)',
  },
  topCenter: {
    top: '7%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  bottomCenter: {
    bottom: '7%',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  panel: {
    position: 'relative',
    minWidth: 238,
    maxWidth: 390,
    padding: '13px 17px 13px 13px',
    border: '1px solid rgba(177, 255, 239, 0.2)',
    borderRadius: 13,
    color: '#effffc',
    background: 'linear-gradient(135deg, rgba(15, 27, 31, 0.98), rgba(6, 14, 18, 0.98))',
    boxShadow: '0 20px 46px rgba(0, 0, 0, 0.46), 0 0 0 1px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 3,
      height: '100%',
      background: '#8fffe8',
      boxShadow: '0 0 18px rgba(143, 255, 232, 0.65)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 110,
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(143, 255, 232, 0.72))',
    },
  },
  iconShell: {
    width: 36,
    height: 36,
    flex: '0 0 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(143, 255, 232, 0.24)',
    borderRadius: 10,
    background: 'rgba(143, 255, 232, 0.08)',
    boxShadow: 'inset 0 0 18px rgba(143, 255, 232, 0.05)',
  },
  eyebrow: {
    marginBottom: 3,
    color: '#6f918c',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 1.7,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  text: {
    color: '#e6f8f4',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.15,
    lineHeight: 1.45,
    whiteSpace: 'pre-line',
  },
  keyHint: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 22,
    minHeight: 19,
    marginRight: 3,
    padding: '1px 5px',
    border: '1px solid rgba(143, 255, 232, 0.3)',
    borderRadius: 5,
    color: '#aaffef',
    background: 'rgba(143, 255, 232, 0.08)',
    fontSize: 10,
    fontWeight: 800,
  },
}));

const positionClasses = {
  'right-center': 'rightCenter',
  'left-center': 'leftCenter',
  'top-center': 'topCenter',
  'bottom-center': 'bottomCenter',
} as const;

const TextUI: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<TextUIData>({ text: '', position: 'right-center' });

  useNuiEvent<TextUIData>('textUi', (nextData) => {
    setData({ ...nextData, position: nextData.position || 'right-center' });
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  const iconData = useMemo(() => {
    if (!data.icon) return null;

    if (Array.isArray(data.icon)) {
      return { icon: data.icon[0], color: data.icon[1] || data.iconColor || '#8fffe8' };
    }

    return { icon: data.icon, color: data.iconColor || '#8fffe8' };
  }, [data.icon, data.iconColor]);

  const position = data.position || 'right-center';
  const customStyle = typeof data.style === 'object' ? data.style : undefined;

  return (
    <Box
      className={`${classes.root} ${classes[positionClasses[position]]}`}
      style={{ opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden' }}
    >
      <Box className={classes.panel} style={customStyle}>
        <Group noWrap spacing={12} align={data.alignIcon === 'top' ? 'flex-start' : 'center'}>
          {iconData && (
            <Box className={classes.iconShell}>
              <LibIcon icon={iconData.icon as IconProp} fixedWidth color={iconData.color} />
            </Box>
          )}
          <Box style={{ minWidth: 0 }}>
            <Text className={classes.eyebrow}>Interaction</Text>
            <Text className={classes.text}>{data.text}</Text>
          </Box>
        </Group>
      </Box>
    </Box>
  );
};

export default TextUI;
