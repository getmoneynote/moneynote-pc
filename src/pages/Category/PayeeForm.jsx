import {useEffect, useState} from "react";
import { useModel } from '@umijs/max';
import {ProFormDigit, ProFormSwitch, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import { create, update } from '@/services/common';
import {requiredRules} from "@/utils/rules";
import {translateAction} from "@/utils/util";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { payeeActionRef, bookId } = useModel('Category.model');
  const { action, currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        canExpense: true,
        canIncome: false,
      });
    } else if (action === 2) {
      setInitialValues({...currentRow});
    }
  }, [action, currentRow]);

  const successHandler = () => {
    payeeActionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    if (action === 1) {
      await create('payees', {...values, ...{ bookId: bookId } });
    } else if (action === 2) {
      await update('payees', currentRow.id, values);
    }
  }

  return (
    <MyModalForm
      title={translateAction(action) + t('tab.payee')}
      labelWidth={80}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={initialValues}
    >
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 6 }} />
      <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 6 }} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
      <ProFormDigit name="sort" label={t('sort')} />
    </MyModalForm>
  );
}
