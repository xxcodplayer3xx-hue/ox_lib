import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? '#55706f' : '#effffc',
    whiteSpace: 'pre-wrap',
  },
  button: {
    height: 'fit-content',
    width: '100%',
    padding: '12px 13px',
    border: '1px solid rgba(177, 255, 239, 0.1)',
    borderLeft: '2px solid rgba(143, 255, 232, 0.24)',
    borderRadius: 10,
    background: 'linear-gradient(110deg, rgba(15, 29, 33, 0.97), rgba(8, 18, 22, 0.97))',
    transition: 'all 120ms ease',
    '&:hover': {
      backgroundColor: params.readOnly ? 'rgba(15, 29, 33, 0.97)' : 'rgba(27, 57, 59, 0.98)',
      borderColor: params.readOnly ? 'rgba(177, 255, 239, 0.1)' : 'rgba(143, 255, 232, 0.36)',
      borderLeftColor: params.readOnly ? 'rgba(143, 255, 232, 0.24)' : '#8fffe8',
      cursor: params.readOnly ? 'unset' : 'pointer',
      transform: params.readOnly ? 'none' : 'translateX(2px)',
    },
    '&:active': {
      transform: params.readOnly ? 'none' : 'translateX(2px) scale(0.99)',
    },
  },
  iconImage: {
    maxWidth: '25px',
  },
  description: {
    color: params.disabled ? '#55706f' : '#9bb7b3',
    fontSize: 12,
  },
  dropdown: {
    padding: 12,
    color: '#d2e5e3',
    fontSize: 12,
    maxWidth: 270,
    width: 'fit-content',
    border: '1px solid rgba(177, 255, 239, 0.14)',
    borderRadius: 9,
    background: 'rgba(10, 20, 23, 0.98)',
  },
  buttonStack: {
    gap: 4,
    flex: '1',
  },
  buttonGroup: {
    gap: 4,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            size="lg"
                            style={{ color: button.iconColor }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress
                    value={button.progress}
                    size="sm"
                    radius="xl"
                    color={button.colorScheme || 'teal'}
                    styles={{ root: { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
                  />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <>
                  <Text key={`context-metadata-${index}`}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      radius="xl"
                      color={metadata.colorScheme || button.colorScheme || 'teal'}
                      styles={{ root: { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }}
                    />
                  )}
                </>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
