import { useEffect, useState } from 'react';
import { useModel } from '@umijs/max';
import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import moment from 'moment';
import { create, update } from '@/services/common';
import { requiredRules } from '@/utils/rules';
import {dateFormatStr2, translateAction} from "@/utils/util";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('NoteDay.model');
  const { action, currentRow } = useModel('modal');
  const [type, setType] = useState(0);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        repeatType: 2,
        interval: 1,
      });
      setType(0);
    } else {
      setInitialValues({
        ...currentRow,
        dateRange: [currentRow.startDate, currentRow.endDate],
      });
      setType(currentRow.repeatType === 0 ? 0 : 1);
    }
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    if (type === 0) {
      values.repeatType = 0;
    }
    if (action !== 2) {
      await create('note-days', values);
    } else {
      await update('note-days', currentRow.id, values);
    }
  };

  return (
    <>
      <MyModalForm
        title={translateAction(action) + t('menu.noteDays')}
        labelWidth={90}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormRadio.Group
          label={t('note.day.add.type')}
          options={[
            {
              label: t('note.day.add.type1'),
              value: 0,
            },
            {
              label: t('note.day.add.type2'),
              value: 1,
            },
          ]}
          fieldProps={{
            value: type,
            optionType: 'button',
            buttonStyle: 'solid',
            onChange: ({ target: { value } }) => setType(value),
          }}
        />
        <ProFormText name="title" label={t('note.day.label.title')} rules={requiredRules()} />
        {type === 0 && (
          <ProFormDatePicker
            name="startDate"
            label={t('note.day.label.start.date')}
            rules={requiredRules()}
            format={dateFormatStr2()}
            allowClear={false}
          />
        )}
        {type !== 0 && (
          <>
            <ProFormDateRangePicker
              name="dateRange"
              label={t('note.day.label.date.range')}
              rules={requiredRules()}
              transform={(value) => ({
                startDate: moment(value[0]).startOf('day').valueOf(),
                endDate: moment(value[1]).endOf('day').valueOf(),
              })}
              fieldProps={{
                format: dateFormatStr2(),
                allowClear: false,
              }}
            />
            <ProFormRadio.Group
              name="repeatType"
              label={t('note.day.label.repeatType')}
              options={[
                {
                  label: t('day'),
                  value: 1,
                },
                {
                  label: t('month'),
                  value: 2,
                },
                {
                  label: t('year'),
                  value: 3,
                },
              ]}
              fieldProps={{
                optionType: 'button',
                buttonStyle: 'solid',
              }}
            />
            <ProFormText
              name="interval"
              label={t('note.day.label.interval')}
              rules={requiredRules()}
            />
          </>
        )}
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
