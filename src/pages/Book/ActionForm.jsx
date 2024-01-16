import {useEffect, useState} from 'react';
import {useModel, useRequest} from '@umijs/max';
import {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import {create, update, queryAll, query} from '@/services/common';
import { treeSelectSingleProp, selectSingleProp } from '@/utils/prop';
import { translateAction } from '@/utils/util';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';


export default () => {

  const { actionRef } = useModel('Book.model');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { action, currentRow } = useModel('modal');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => queryAll('accounts'), { manual: true });

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest((params) => query('categories', {
    ...params,
    'bookId': currentRow?.id,
    'enable': true,
  }), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        defaultCurrencyCode: initialState.currentGroup.defaultCurrencyCode,
      });
    } else {
      setInitialValues({
        ...currentRow,
        defaultExpenseAccountId: currentRow.defaultExpenseAccount,
        defaultIncomeAccountId: currentRow.defaultIncomeAccount,
        defaultExpenseCategoryId: currentRow.defaultExpenseCategory,
        defaultIncomeCategoryId: currentRow.defaultIncomeCategory,
        defaultTransferFromAccountId: currentRow.defaultTransferFromAccount,
        defaultTransferToAccountId: currentRow.defaultTransferToAccount,
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
    let form = JSON.parse(JSON.stringify(values));
    form.defaultExpenseAccountId = form.defaultExpenseAccountId?.id;
    form.defaultIncomeAccountId = form.defaultIncomeAccountId?.id;
    form.defaultTransferFromAccountId = form.defaultTransferFromAccountId?.id;
    form.defaultTransferToAccountId = form.defaultTransferToAccountId?.id;
    form.defaultExpenseCategoryId = form.defaultExpenseCategoryId?.value;
    form.defaultIncomeCategoryId = form.defaultIncomeCategoryId?.value;
    if (action !== 2) {
      await create('books', form);
    } else {
      await update('books', currentRow.id, form);
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
        {action === 2 && (
          <>
            <ProFormTreeSelect
              name="defaultExpenseCategoryId"
              label={t('book.label.default.expense.category')}
              fieldProps={{
                ...treeSelectSingleProp,
                onFocus: () => loadCategories({'type': 'EXPENSE'}),
                loading: categoriesLoading,
                options: categories,
              }}
            />
            <ProFormTreeSelect
              name="defaultIncomeCategoryId"
              label={t('book.label.default.income.category')}
              fieldProps={{
                ...treeSelectSingleProp,
                onFocus: () => loadCategories({'type': 'INCOME'}),
                loading: categoriesLoading,
                options: categories,
              }}
            />
          </>
        )}
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
