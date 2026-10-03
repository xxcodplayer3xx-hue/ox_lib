import { Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  contentStack: {
    color: theme.colors.dark[2],
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.72}
        overlayColor="#03090c"
        exitTransitionDuration={150}
        transition="pop"
        title={<ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
        styles={{
          modal: {
            background: 'linear-gradient(145deg, rgba(15, 27, 31, 0.99), rgba(7, 16, 20, 0.99))',
            border: '1px solid rgba(177, 255, 239, 0.18)',
            borderTop: '2px solid #8fffe8',
            borderRadius: 13,
            boxShadow: '0 24px 65px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.24)',
          },
          title: { color: '#f1fffc', fontSize: 17, fontWeight: 800, letterSpacing: 0.5 },
          close: { color: '#9bb7b3' },
          header: { background: 'transparent', paddingBottom: 8 },
          body: { paddingTop: 8 },
        }}
      >
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
          <Group position="right" spacing={10}>
            {dialogData.cancel && (
              <Button
                uppercase
                variant="default"
                onClick={() => closeAlert('cancel')}
                mr={3}
                styles={{ root: { background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(177, 255, 239, 0.14)', color: '#a7c3bf' } }}
              >
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              uppercase
              variant="filled"
              color={theme.primaryColor}
              onClick={() => closeAlert('confirm')}
              styles={{ root: { boxShadow: '0 8px 18px rgba(113, 237, 218, 0.18)', color: '#071114' } }}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;
