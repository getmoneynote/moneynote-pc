import {useEffect, useMemo, useState} from 'react';
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
import { translateAction } from '@/utils/util';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';


export default () => {

  const { actionRef } = useModel('Book.model');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { action, currentRow, visible } = useModel('modal');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => getAll('currencies'), { manual: true });

  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => getAll('accounts'), { manual: true });
  const expenseAccountOptions = useMemo(() => {
    let options = accounts.filter(i => i.canExpense);
    if (action !== 1) {
      if (currentRow.defaultExpenseAccount) {
        if (!options.some(e => e.id === currentRow.defaultExpenseAccount.id)) {
          options.unshift(currentRow.defaultExpenseAccount);
        }
      }
    }
    return options;
  }, [accounts, action, currentRow]);
  const incomeAccountOptions = useMemo(() => {
    let options = accounts.filter(i => i.canIncome);
    if (action !== 1) {
      if (currentRow.defaultIncomeAccount) {
        if (!options.some(e => e.id === currentRow.defaultIncomeAccount.id)) {
          options.unshift(currentRow.defaultIncomeAccount);
        }
      }
    }
    return options;
  }, [accounts, action, currentRow]);
  const transferFromAccountOptions = useMemo(() => {
    let options = accounts.filter(i => i.canTransferFrom);
    if (action !== 1) {
      if (currentRow.defaultTransferFromAccount) {
        if (!options.some(e => e.id === currentRow.defaultTransferFromAccount.id)) {
          options.unshift(currentRow.defaultTransferFromAccount);
        }
      }
    }
    return options;
  }, [accounts, action, currentRow]);
  const transferToAccountOptions = useMemo(() => {
    let options = accounts.filter(i => i.canTransferTo);
    if (action !== 1) {
      if (currentRow.defaultTransferToAccount) {
        if (!options.some(e => e.id === currentRow.defaultTransferToAccount.id)) {
          options.unshift(currentRow.defaultTransferToAccount);
        }
      }
    }
    return options;
  }, [accounts, action, currentRow]);

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => getAll('categories'), { manual: true });
  const expenseCategoryOptions = useMemo(() => {
    let options = categories.filter(i => i.canExpense);
    if (action !== 1) {
      if (currentRow.defaultExpenseCategory) {
        if (!options.some(e => e.id === currentRow.defaultExpenseCategory.id)) {
          options.unshift(currentRow.defaultExpenseCategory);
        }
      }
    }
    return options;
  }, [categories, action, currentRow]);
  const incomeCategoryOptions = useMemo(() => {
    let options = categories.filter(i => i.canIncome);
    if (action !== 1) {
      if (currentRow.defaultIncomeCategory) {
        if (!options.some(e => e.id === currentRow.defaultIncomeCategory.id)) {
          options.unshift(currentRow.defaultIncomeCategory);
        }
      }
    }
    return options;
  }, [categories, action, currentRow]);

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
        title={ translateAction(action) + t('book') }
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
            options: expenseAccountOptions,
            showSearch: true,
            allowClear: true
          }}
        />
        <ProFormSelect
          name="defaultIncomeAccountId"
          label={t('book.label.default.income.account')}
          fieldProps={{
            loading: accountsLoading,
            options: incomeAccountOptions,
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
                options: expenseCategoryOptions,
                ...treeSelectSingleProp,
              }}
            />
            <ProFormTreeSelect
              name="defaultIncomeCategoryId"
              label={t('book.label.default.income.category')}
              fieldProps={{
                loading: categoriesLoading,
                options: incomeCategoryOptions,
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
            options: transferFromAccountOptions,
            showSearch: true,
            allowClear: true
          }}
        />
        <ProFormSelect
          name="defaultTransferToAccountId"
          label={t('book.label.default.transfer.to.account')}
          fieldProps={{
            loading: accountsLoading,
            options: transferToAccountOptions,
            showSearch: true,
            allowClear: true
          }}
        />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
