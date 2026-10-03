import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, createStyles, Group, keyframes, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles(() => ({
  container: {
    position: 'relative',
    width: 356,
    minHeight: 72,
    height: 'fit-content',
    padding: '14px 16px 14px 14px',
    overflow: 'hidden',
    border: '1px solid rgba(177, 255, 239, 0.14)',
    borderRadius: 12,
    color: '#f1fffc',
    fontFamily: 'Space Grotesk, sans-serif',
    background: 'linear-gradient(135deg, rgba(15, 27, 31, 0.98), rgba(7, 16, 20, 0.98))',
    boxShadow: '0 18px 42px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(0, 0, 0, 0.24)',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 110,
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(143, 255, 232, 0.7))',
    },
  },
  title: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.35,
    lineHeight: 1.3,
  },
  description: {
    marginTop: 3,
    fontSize: 12,
    color: '#9bb7b3',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: 1.45,
  },
  descriptionOnly: {
    fontSize: 13,
    color: '#b3ccc8',
    fontFamily: 'Space Grotesk, sans-serif',
    lineHeight: 1.45,
  },
  meta: {
    marginBottom: 3,
    color: '#6c8a86',
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
}));

const statusColors: Record<string, string> = {
  error: '#ff7d8b',
  success: '#8fffe8',
  warning: '#ffd37d',
  info: '#8fc9ff',
};

const statusLabels: Record<string, string> = {
  error: 'Attention',
  success: 'Complete',
  warning: 'Caution',
  info: 'Information',
};

const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: {
    opacity: visible ? 0 : 1,
    transform: `translate${from}`,
  },
  to: {
    opacity: visible ? 1 : 0,
    transform: `translate${to}`,
  },
});

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards'
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom') ? { from: 'Y(30px)', to: 'Y(0px)' } : { from: 'Y(-30px)', to:'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' }
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom-center') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`
};

const durationCircle = keyframes({
  '0%': { strokeDasharray: `0, ${15.1 * 2 * Math.PI}` },
  '100%': { strokeDasharray: `${15.1 * 2 * Math.PI}, 0` },
});

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const notification = { ...data };
    const toastId = notification.id?.toString();
    const duration = notification.duration || 3000;
    let position = notification.position || 'top-right';
    const type = notification.type || 'info';
    const icon = notification.icon || (type === 'error'
      ? 'circle-xmark'
      : type === 'success'
      ? 'circle-check'
      : type === 'warning'
      ? 'circle-exclamation'
      : 'circle-info');
    const iconColor = notification.iconColor || statusColors[type] || statusColors.info;
    const showDuration = notification.showDuration !== false;

    if (toastId) setToastKey((previousKey) => previousKey + 1);

    if (position === 'top') position = 'top-center';
    if (position === 'bottom') position = 'bottom-center';

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            borderLeft: `3px solid ${iconColor}`,
            ...notification.style,
          }}
          className={classes.container}
        >
          <Group noWrap spacing={13} align="flex-start">
            {icon && (
              showDuration ? (
                <RingProgress
                  key={toastKey}
                  size={42}
                  thickness={2}
                  sections={[{ value: 100, color: iconColor }]}
                  style={{ alignSelf: notification.alignIcon === 'top' ? 'flex-start' : 'center' }}
                  styles={{
                    root: {
                      '> svg > circle:nth-of-type(2)': {
                        animation: `${durationCircle} linear forwards reverse`,
                        animationDuration: `${duration}ms`,
                      },
                      margin: -3,
                    },
                  }}
                  label={
                    <Center>
                      <ThemeIcon
                        color={iconColor}
                        radius="xl"
                        size={32}
                        variant="light"
                        style={{ backgroundColor: `${iconColor}18` }}
                      >
                        <LibIcon icon={icon} fixedWidth color={iconColor} animation={notification.iconAnimation} />
                      </ThemeIcon>
                    </Center>
                  }
                />
              ) : (
                <ThemeIcon
                  color={iconColor}
                  radius="xl"
                  size={36}
                  variant="light"
                  style={{ alignSelf: notification.alignIcon === 'top' ? 'flex-start' : 'center' }}
                >
                  <LibIcon icon={icon} fixedWidth color={iconColor} animation={notification.iconAnimation} />
                </ThemeIcon>
              )
            )}
            <Stack spacing={0} style={{ flex: 1, minWidth: 0 }}>
              <Text className={classes.meta}>{statusLabels[type] || statusLabels.info}</Text>
              {notification.title && <Text className={classes.title}>{notification.title}</Text>}
              {notification.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!notification.title ? classes.descriptionOnly : classes.description} description`}
                >
                  {notification.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration,
        position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
