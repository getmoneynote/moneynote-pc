import { useEffect, useState } from 'react';
import {useModel, useRequest} from '@umijs/max';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import { create, update, getAll } from '@/services/common';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';


export default () => {

  const { actionRef } = useModel('Book.model');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { action, currentRow, visible } = useModel('modal');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => getAll('currencies'), { manual: true });
  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => getAll('accounts'), { manual: true });
  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => getAll('categories'), { manual: true });

  useEffect(() => {
    if (visible) {
      loadCurrencies();
      loadAccounts();
      loadCategories();
    }
  }, [visible]);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        defaultCurrencyCode: initialState.currentGroup.defaultCurrencyCode,
      });
    } else {
      setInitialValues({
        ...currentRow,
        defaultExpenseAccountId: currentRow.defaultExpenseAccount?.id,
        defaultIncomeAccountId: currentRow.defaultIncomeAccount?.id,
        defaultExpenseCategoryId: currentRow.defaultExpenseCategory?.id,
        defaultIncomeCategoryId: currentRow.defaultIncomeCategory?.id,
        defaultTransferFromAccountId: currentRow.defaultTransferFromAccount?.id,
        defaultTransferToAccountId: currentRow.defaultTransferToAccount?.id,
      });
    }
  }, [action, currentRow]);

  const successHandler = async () => {
    actionRef.current?.reload();
    if (action === 2) {
      const response = await initialState.fetchUserInfo();
      setInitialState(prevState => ({
        ...prevState,
        currentBook: response.book,
      }))
    }
  };

  const requestHandler = async (values) => {
    if (action !== 2) {
      await create('books', values);
    } else {
      await update('books', currentRow.id, values);
    }
  };

  return (
    <>
      <MyModalForm
        title={(action === 1 ? t('add') : t('update')) + t('book')}
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
          fieldProps={{
            loading: currenciesLoading,
            options: currencies,
            showSearch: true,
            allowClear: false
        }}
        />
        <ProFormSelect
          name="defaultExpenseAccountId"
          label={t('book.label.default.expense.account')}
          fieldProps={{
            loading: accountsLoading,
            options: accounts.filter(i => i.canExpense),
            showSearch: true,
            allowClear: true
          }}
        />
        <ProFormSelect
          name="defaultIncomeAccountId"
          label={t('book.label.default.income.account')}
          fieldProps={{
            loading: accountsLoading,
            options: accounts.filter(i => i.canIncome),
            showSearch: true,
            allowClear: true
          }}
        />
        {action === 2 && (
          <>
            <ProFormTreeSelect
              name="defaultExpenseCategoryId"
              label={t('book.label.default.expense.category')}
              fieldProps={{
                loading: categoriesLoading,
                options: categories.filter(i => i.canExpense),
                ...treeSelectSingleProp,
              }}
            />
            <ProFormTreeSelect
              name="defaultIncomeCategoryId"
              label={t('book.label.default.income.category')}
              fieldProps={{
                loading: categoriesLoading,
                options: categories.filter(i => i.canIncome),
                ...treeSelectSingleProp,
              }}
            />
          </>
        )}
        <ProFormSelect
          name="defaultTransferFromAccountId"
          label={t('book.label.default.transfer.from.account')}
          fieldProps={{
            loading: accountsLoading,
            options: accounts.filter(i => i.canTransferFrom),
            showSearch: true,
            allowClear: true
          }}
        />
        <ProFormSelect
          name="defaultTransferToAccountId"
          label={t('book.label.default.transfer.to.account')}
          fieldProps={{
            loading: accountsLoading,
            options: accounts.filter(i => i.canTransferTo),
            showSearch: true,
            allowClear: true
          }}
        />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
