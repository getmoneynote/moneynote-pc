import {useEffect, useState} from 'react';
import {useModel, useRequest} from '@umijs/max';
import {ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import { createByTemplate } from '@/services/book';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import {selectSingleProp} from "@/utils/prop";
import { queryAll } from "@/services/common";
import t from '@/utils/i18n';

export default () => {

  const { initialState } = useModel('@@initialState');
  const { currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    setInitialValues({
      defaultCurrencyCode: initialState.currentGroup.defaultCurrencyCode,
    });
  }, [currentRow]);

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => queryAll('accounts'), { manual: true });

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    form.defaultExpenseAccountId = form.defaultExpenseAccountId?.id;
    form.defaultIncomeAccountId = form.defaultIncomeAccountId?.id;
    form.defaultTransferFromAccountId = form.defaultTransferFromAccountId?.id;
    form.defaultTransferToAccountId = form.defaultTransferToAccountId?.id;
    form.defaultExpenseCategoryId = form.defaultExpenseCategoryId?.value;
    form.defaultIncomeCategoryId = form.defaultIncomeCategoryId?.value;
    await createByTemplate({
      ...{
        templateId: currentRow.id
      },
      ...{
        book: form
      }
    });
  };

  return (
    <>
      <MyModalForm
        title={t('copy') + currentRow.name}
        labelWidth={90}
        request={requestHandler}
        initialValues={initialValues}
      >
        <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
        <ProFormSelect
          name="defaultCurrencyCode"
          label={t('book.label.default.currency')}
          rules={requiredRules()}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadCurrencies,
            loading: currenciesLoading,
            options: currencies,
            allowClear: false,
            labelInValue: false,
          }}
        />
        <ProFormSelect
          name="defaultExpenseAccountId"
          label={t('book.label.default.expense.account')}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadAccounts,
            loading: accountsLoading,
            options: accounts.filter(i => i.canExpense),
          }}
        />
        <ProFormSelect
          name="defaultIncomeAccountId"
          label={t('book.label.default.income.account')}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadAccounts,
            loading: accountsLoading,
            options: accounts.filter(i => i.canIncome),
          }}
        />
        <ProFormSelect
          name="defaultTransferFromAccountId"
          label={t('book.label.default.transfer.from.account')}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadAccounts,
            loading: accountsLoading,
            options: accounts.filter(i => i.canTransferFrom),
          }}
        />
        <ProFormSelect
          name="defaultTransferToAccountId"
          label={t('book.label.default.transfer.to.account')}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadAccounts,
            loading: accountsLoading,
            options: accounts.filter(i => i.canTransferTo),
          }}
        />
        <ProFormTextArea name="notes" label={t('label.notes')} />
        <ProFormDigit name="sort" label={t('sort')} />
      </MyModalForm>
    </>
  );
};
