import {useEffect, useState} from 'react';
import {useModel, useRequest} from '@umijs/max';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import {create, update, queryAll} from '@/services/common';
import { selectSingleProp } from '@/utils/prop';
import { translateAction } from '@/utils/util';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';


export default () => {

  const { actionRef } = useModel('Group.model');
  const { action, currentRow } = useModel('modal');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({

      });
    } else {
      setInitialValues({
        ...currentRow,
      });
    }
  }, [action, currentRow]);

  const successHandler = async () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    if (action !== 2) {
      await create('groups', values);
    } else {
      await update('groups', currentRow.id, values);
    }
  };

  return (
    <>
      <MyModalForm
        title={ translateAction(action) + t('group') }
        labelWidth={95}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
        <ProFormSelect
          name="defaultCurrencyCode"
          label={t('book.label.default.currency')}
          rules={requiredRules()}
          disabled={action === 2}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadCurrencies,
            loading: currenciesLoading,
            options: currencies,
            allowClear: false,
            labelInValue: false,
          }}
        />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
