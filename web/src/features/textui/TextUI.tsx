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

const useStyles = createStyles(() => ({
  root: {
    position: 'fixed',
    zIndex: 1000,
    pointerEvents: 'none',
    transition: 'opacity 180ms ease, visibility 180ms ease',
  },
  rightCenter: {
    top: '50%',
    right: '3.25%',
    transform: 'translateY(-50%)',
  },
  leftCenter: {
    top: '50%',
    left: '3.25%',
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
    minWidth: 270,
    maxWidth: 430,
    padding: '12px 15px 13px 13px',
    border: '1px solid rgba(146, 255, 232, 0.2)',
    borderRadius: 14,
    color: '#f0fffc',
    background: 'linear-gradient(145deg, rgba(18, 31, 35, 0.98), rgba(7, 14, 18, 0.98))',
    boxShadow: '0 22px 55px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 1px rgba(255, 255, 255, 0.04)',
    overflow: 'hidden',
    animation: 'textUiEnter 220ms ease-out both',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 3,
      height: '100%',
      background: '#91ffe9',
      boxShadow: '0 0 20px rgba(145, 255, 233, 0.75)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 145,
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(145, 255, 233, 0.8))',
    },
  },
  topRow: {
    marginBottom: 9,
  },
  iconShell: {
    width: 38,
    height: 38,
    flex: '0 0 38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(145, 255, 233, 0.28)',
    borderRadius: 10,
    color: '#91ffe9',
    background: 'linear-gradient(145deg, rgba(145, 255, 233, 0.14), rgba(145, 255, 233, 0.03))',
    boxShadow: 'inset 0 0 20px rgba(145, 255, 233, 0.06), 0 0 18px rgba(145, 255, 233, 0.08)',
  },
  heading: {
    color: '#effffc',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.7,
    lineHeight: 1.1,
    textTransform: 'uppercase',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    color: '#6f918c',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.4,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#91ffe9',
    boxShadow: '0 0 9px rgba(145, 255, 233, 0.9)',
  },
  textList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: '9px 10px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 9,
    background: 'rgba(255, 255, 255, 0.035)',
  },
  textLine: {
    color: '#e6f8f4',
    fontFamily: 'Space Grotesk, sans-serif',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.1,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
  },
  keyHint: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 23,
    minHeight: 20,
    marginRight: 4,
    padding: '1px 6px',
    border: '1px solid rgba(145, 255, 233, 0.38)',
    borderRadius: 5,
    color: '#aaffef',
    background: 'rgba(145, 255, 233, 0.1)',
    boxShadow: 'inset 0 0 10px rgba(145, 255, 233, 0.05)',
    fontFamily: 'Space Mono, monospace',
    fontSize: 10,
    fontWeight: 700,
    lineHeight: 1,
  },
  divider: {
    width: '100%',
    height: 1,
    marginTop: 10,
    background: 'linear-gradient(90deg, rgba(145, 255, 233, 0.32), transparent)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 7,
    color: '#55716d',
    fontFamily: 'Space Mono, monospace',
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
}));

const promptTokenPattern = /\[[^\]]+\]/g;

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
  const lines = data.text.split(/\r?\n/);

  const renderLine = (line: string, lineIndex: number) => {
    const parts = line.split(promptTokenPattern);
    const tokens = line.match(promptTokenPattern) || [];

    return (
      <Text className={classes.textLine} key={`text-ui-line-${lineIndex}`}>
        {parts.map((part, partIndex) => (
          <React.Fragment key={`text-ui-part-${lineIndex}-${partIndex}`}>
            {part}
            {tokens[partIndex] && (
              <Box component="span" className={classes.keyHint}>
                {tokens[partIndex].slice(1, -1)}
              </Box>
            )}
          </React.Fragment>
        ))}
      </Text>
    );
  };

  return (
    <Box
      className={`${classes.root} ${classes[positionClasses[position]]}`}
      style={{ opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden' }}
      aria-hidden={!visible}
    >
      <Box className={classes.panel} style={customStyle}>
        <Group className={classes.topRow} noWrap spacing={11} align={data.alignIcon === 'top' ? 'flex-start' : 'center'}>
          {iconData && (
            <Box className={classes.iconShell}>
              <LibIcon icon={iconData.icon as IconProp} fixedWidth color={iconData.color} />
            </Box>
          )}
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Text className={classes.heading}>Interaction available</Text>
            <Text className={classes.status}>
              <Box component="span" className={classes.statusDot} />
              Awaiting input
            </Text>
          </Box>
        </Group>
        <Box className={classes.textList}>{lines.map(renderLine)}</Box>
        <Box className={classes.divider} />
        <Box className={classes.footer}>
          <span>Local prompt</span>
          <span>ox_lib</span>
        </Box>
      </Box>
    </Box>
  );
};

export default TextUI;
