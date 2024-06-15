import {useEffect, useState} from "react";
import {useModel, useRequest} from '@umijs/max';
import {ProFormSelect, ProFormText} from '@ant-design/pro-components';
import {requiredRules} from "@/utils/rules";
import {queryAll, update} from "@/services/common";
import {updateRates} from "@/services/currency";
import {selectSingleProp} from "@/utils/prop";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ item }) => {

  const { actionRef } = useModel('Currency.model');
  const { action, currentRow } = useModel('modal');
  const { data : currencyOptions = [], loading : currencyLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    setInitialValues({...currentRow});
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    await updateRates(currentRow.id, values);
  }

  return (
    <MyModalForm
      title={ t('action.title', {'action': t('update'), 'title': t('account.rate')} ) + ' - ' + item.name }
      labelWidth={100}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={initialValues}
    >
      <ProFormSelect
        name="base"
        label={t('currency.base')}
        rules={requiredRules()}
        initialValue='USD'
        fieldProps={{
          ...selectSingleProp,
          onFocus: loadCurrencies,
          options: currencyOptions,
          loading: currencyLoading,
          allowClear: false,
        }}
      />
      <ProFormText name="rate" label={t('account.rate')} rules={requiredRules()} />
    </MyModalForm>
  );
}
