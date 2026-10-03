import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    background: 'linear-gradient(110deg, rgba(15, 29, 33, 0.97), rgba(8, 18, 22, 0.97))',
    border: '1px solid rgba(177, 255, 239, 0.1)',
    borderLeft: '2px solid rgba(143, 255, 232, 0.24)',
    borderRadius: 10,
    padding: 3,
    height: 64,
    scrollMargin: 8,
    transition: 'all 120ms ease',
    '&:hover': {
      background: 'linear-gradient(110deg, rgba(27, 57, 59, 0.98), rgba(12, 28, 31, 0.98))',
      borderColor: 'rgba(143, 255, 232, 0.36)',
      borderLeftColor: '#8fffe8',
      transform: 'translateX(2px)',
    },
    '&:focus': {
      backgroundColor: '#1b393b',
      borderColor: '#8fffe8',
      outline: 'none',
      boxShadow: '0 0 0 1px rgba(143, 255, 232, 0.2), 0 0 20px rgba(113, 237, 218, 0.12)',
    },
  },
  iconImage: {
    maxWidth: 32,
  },
  buttonWrapper: {
    paddingLeft: 5,
    paddingRight: 12,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  icon: {
    fontSize: 24,
    color: params.iconColor || '#8fffe8',
  },
  label: {
    color: '#dcebea',
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.6,
    verticalAlign: 'middle',
  },
  chevronIcon: {
    fontSize: 14,
    color: '#86aaa8',
  },
  scrollIndexValue: {
    color: '#86aaa8',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'teal'}
              radius="xl"
              styles={{ root: { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
            />
          </Stack>
        ) : (
          <Text>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
