import {useEffect, useState} from "react";
import {useModel, useRequest} from '@umijs/max';
import {ProFormText, ProFormTextArea, ProFormSelect, ProFormSwitch} from '@ant-design/pro-components';
import {create, queryAll, update} from '@/services/common';
import {translateAccountType, translateAction} from '@/utils/util';
import {amountRequiredRules, requiredRules} from "@/utils/rules";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { action, currentRow } = useModel('modal');
  const { initialState } = useModel('@@initialState');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      const initialValues = {
        include: true,
        canExpense: true,
        canIncome: true,
        canTransferFrom: true,
        canTransferTo: true,
        currencyCode: initialState.currentGroup.defaultCurrencyCode,
      }
      switch (type) {
        case 'CHECKING':
          setInitialValues(initialValues);
          break;
        case 'CREDIT':
          setInitialValues({
            ...initialValues,
            canIncome: false,
            canTransferFrom: false,
          });
          break;
        case 'ASSET':
          setInitialValues({
            ...initialValues,
            canExpense: false,
            canIncome: false,
          });
          break;
        case 'DEBT':
          setInitialValues({
            ...initialValues,
            canExpense: false,
            canIncome: false,
          });
          break;
      }
    } else if (action === 2) {
      // 数字类型的校验存在问题, antd bug
      setInitialValues({...currentRow, balance: currentRow.balance.toString()});
    }
  }, [action, type, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    if (action === 1) {
      await create('accounts', { ...values, ...{ type: type } });
    } else if (action === 2) {
      await update('accounts', currentRow.id, values);
    }
  }

  return (
    <>
      <MyModalForm
        title={ translateAction(action) + translateAccountType(type) }
        labelWidth={85}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormSelect
          name="currencyCode"
          label={t('account.label.currencyCode')}
          rules={requiredRules()}
          disabled={action !== 1}
          fieldProps={{
            onFocus: loadCurrencies,
            loading: currenciesLoading,
            options: currencies,
            showSearch: true,
            allowClear: false
          }}
        />
        <ProFormText
          name="name"
          label={t('label.name')}
          rules={requiredRules()}
        />
        <ProFormText
          disabled={action === 2}
          name="balance"
          label={t('account.label.balance')}
          rules={amountRequiredRules()}
        />
        {
          (type === 'CREDIT' || type === 'DEBT') &&
          <ProFormText
            name="creditLimit"
            label={t('account.label.credit.limit')}
          />
        }
        {
          (type === 'CREDIT' || type === 'DEBT') &&
          <ProFormSelect
            name="billDay"
            label={type === 'CREDIT' ? t('account.label.bill.day') : t('account.label.bill.day.debt')}
            fieldProps={{
              options: Array(31).fill(0).map((_, i) => {return { label: i+1, value: i+1 }}),
              showSearch: true
            }}
          />
        }
        {
          type === 'DEBT' &&
          <ProFormText
            name="apr"
            label={t('account.label.apr')}
          />
        }
        <ProFormText name="no" label={t('account.label.no')} />
        <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="canTransferFrom" label={t('account.label.canTransferFrom')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="canTransferTo" label={t('account.label.canTransferTo')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="include" label={t('account.label.include')} />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
}
