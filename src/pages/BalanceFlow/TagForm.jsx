import {useEffect, useState} from "react";
import { useModel } from '@umijs/max';
import {ProFormText} from '@ant-design/pro-components';
import {requiredRules} from "@/utils/rules";
import { update } from "@/services/common";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ flow }) => {

  const { actionRef } = useModel('BalanceFlow.model');
  const { action, currentRow } = useModel('modal');
  const { initialState } = useModel('@@initialState');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    setInitialValues({...currentRow});
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    await update('tag-relations', currentRow.id, values);
  }

  return (
    <MyModalForm
      title={t('update.tag.amount')}
      labelWidth={100}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={initialValues}
    >
      <ProFormText name="amount" label={t('flow.label.tag.amount')} rules={requiredRules()} />
      {
        initialState.currentBook.defaultCurrencyCode !== flow.account.currencyCode &&
        <ProFormText name="convertedAmount" label={t('convertCurrency', {code: initialState.currentBook.defaultCurrencyCode})} rules={requiredRules()} />
      }
    </MyModalForm>
  );
}
