import {useEffect, useState} from "react";
import {useModel, useRequest} from '@umijs/max';
import {ProFormText, ProFormTextArea, ProFormSelect, ProFormSwitch, ProFormDigit} from '@ant-design/pro-components';
import {create, queryAll, update} from '@/services/common';
import {translateAccountType, translateAction} from '@/utils/util';
import {selectSingleProp} from '@/utils/prop';
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
        currencyCode: {
          label: initialState.currentGroup.defaultCurrencyCode,
          value: initialState.currentGroup.defaultCurrencyCode,
        },
      }
      setInitialValues(initialValues);
    } else if (action === 2) {
      // 数字类型的校验存在问题, antd bug
      setInitialValues({...currentRow, balance: currentRow.balance.toString()});
    }
  }, [action, type, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    if (action === 1) {
      form.currencyCode = form.currencyCode.value;
      await create('accounts', { ...form, ...{ type: type } });
    } else if (action === 2) {
      await update('accounts', currentRow.id, form);
    }
  }

  return (
    <>
      <MyModalForm
        title={ translateAction(action) + translateAccountType(type) }
        width={700}
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
            ...selectSingleProp,
            onFocus: loadCurrencies,
            loading: currenciesLoading,
            options: currencies,
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
          placeholder={t('placeholder.can.negative')}
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
        <ProFormDigit name="sort" label={t('sort')} />
      </MyModalForm>
    </>
  );
}
