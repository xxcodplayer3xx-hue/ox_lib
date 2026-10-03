import { Button, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();
  const closeTimeout = React.useRef<number | null>(null);

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    form.reset();
    fieldForm.remove();

    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? // Set date to current one if default is set to true
                  row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked,
        } || { value: null }
      );
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', () => handleClose(true));

  const handleClose = (dontPost?: boolean) => {
    setVisible(false);
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = window.setTimeout(() => {
      form.reset();
      fieldForm.remove();
      closeTimeout.current = null;
      if (!dontPost) {
        fetchNui('inputData');
      }
    }, 200);
  };

  const onSubmit = form.handleSubmit((data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = window.setTimeout(() => {
      form.reset();
      fieldForm.remove();
      closeTimeout.current = null;
      fetchNui('inputData', values);
    }, 200);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size={fields.options?.size || 'xs'}
        title={fields.heading}
        withCloseButton={false}
        overlayOpacity={0.72}
        overlayColor="#03090c"
        transition="pop"
        exitTransitionDuration={150}
        styles={{
          modal: {
            background: 'linear-gradient(145deg, rgba(15, 27, 31, 0.99), rgba(7, 16, 20, 0.99))',
            border: '1px solid rgba(177, 255, 239, 0.18)',
            borderTop: '2px solid #8fffe8',
            borderRadius: 13,
            boxShadow: '0 24px 65px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.24)',
          },
          title: { color: '#f1fffc', fontSize: 17, fontWeight: 800, letterSpacing: 0.5 },
          header: { background: 'transparent', paddingBottom: 8 },
          body: { paddingTop: 8 },
        }}
      >
        <form onSubmit={onSubmit}>
          <Stack>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <DateField control={form.control} row={row} index={index} />
                  ) : null}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </React.Fragment>
              );
            })}
            <Group position="right" spacing={10}>
              <Button
                uppercase
                variant="default"
                onClick={() => handleClose()}
                mr={3}
                disabled={fields.options?.allowCancel === false}
                styles={{ root: { background: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(177, 255, 239, 0.14)', color: '#a7c3bf' } }}
              >
                {locale.ui.cancel}
              </Button>
              <Button
                uppercase
                variant="filled"
                type="submit"
                styles={{ root: { boxShadow: '0 8px 18px rgba(113, 237, 218, 0.18)', color: '#071114' } }}
              >
                {locale.ui.confirm}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
