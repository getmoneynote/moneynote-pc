import {useEffect, useMemo, useState} from 'react';
import { Col, Form, Row, Space, Tabs } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { useModel, useRequest } from '@umijs/max';
import moment from 'moment';
import { isEqual } from '@/utils/util';
import { getAll, create, update } from '@/services/common';
import { treeSelectSingleProp, treeSelectMultipleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('BalanceFlow.model');
  const { initialState } = useModel('@@initialState');
  const { action, currentRow, visible } = useModel('modal');
  const [tabKey, setTabKey] = useState('EXPENSE');

  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => getAll('accounts'), { manual: true });
  const accountOptions = useMemo(() => {
    switch (tabKey) {
      case 'EXPENSE':
        return accounts.filter(i => i.canExpense);
      case 'INCOME':
        return accounts.filter(i => i.canIncome);
      case 'TRANSFER':
        return accounts.filter(i => i.canTransferFrom);
      default:
        return accounts;
    }
  }, [tabKey, accounts]);

  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(() => getAll('payees'), { manual: true });
  const payeeOptions = useMemo(() => {
    if (tabKey === 'EXPENSE') {
      return payees.filter(i => i.canExpense);
    }
    if (tabKey === 'INCOME') {
      return payees.filter(i => i.canIncome);
    }
  }, [tabKey, payees]);

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => getAll('categories'), { manual: true });
  const categoryOptions = useMemo(() => {
    if (tabKey === 'EXPENSE') {
      return categories.filter(i => i.canExpense);
    }
    if (tabKey === 'INCOME') {
      return categories.filter(i => i.canIncome);
    }
  }, [tabKey, categories]);

  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => getAll('tags'), { manual: true });
  const tagOptions = useMemo(() => {
    switch (tabKey) {
      case 'EXPENSE':
        return tags.filter(i => i.canExpense);
      case 'INCOME':
        return tags.filter(i => i.canIncome);
      case 'TRANSFER':
        return tags.filter(i => i.canTransfer);
    }
  }, [tabKey, tags]);

  // 为了解决默认值的问题
  useEffect(() => {
    if (visible) {
      loadAccounts();
      loadCategories();
      loadPayees();
      loadTags();
    }
  }, [visible]);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      let accountId = null;
      let categories = [{}];
      let toId = null;
      if (tabKey === 'EXPENSE') {
        if (initialState.currentBook.defaultExpenseAccount) {
          accountId = initialState.currentBook.defaultExpenseAccount.id;
          setAccountCurrencyCode(initialState.currentBook.defaultExpenseAccount.currencyCode);
        } else {
          setAccountCurrencyCode(null);
        }
        if (initialState.currentBook.defaultExpenseCategory) {
          categories = [{ categoryId: initialState.currentBook.defaultExpenseCategory.id }];
        }
      } else if (tabKey === 'INCOME') {
        if (initialState.currentBook.defaultIncomeAccount) {
          accountId = initialState.currentBook.defaultIncomeAccount.id;
          setAccountCurrencyCode(initialState.currentBook.defaultIncomeAccount.currencyCode);
        } else {
          setAccountCurrencyCode(null);
        }
        if (initialState.currentBook.defaultIncomeCategory) {
          categories = [{ categoryId: initialState.currentBook.defaultIncomeCategory.id }];
        }
      } else if (tabKey === 'TRANSFER') {
        if (initialState.currentBook.defaultTransferFromAccount) {
          accountId = initialState.currentBook.defaultTransferFromAccount.id;
          setAccountCurrencyCode(initialState.currentBook.defaultTransferFromAccount.currencyCode);
        } else {
          setAccountCurrencyCode(null);
        }
        if (initialState.currentBook.defaultTransferToAccount) {
          toId = initialState.currentBook.defaultTransferToAccount.id;
          setToAccountCurrencyCode(initialState.currentBook.defaultTransferToAccount.currencyCode);
        } else {
          setToAccountCurrencyCode(null);
        }
      }
      setInitialValues({
        createTime: moment(),
        accountId: accountId,
        categories: categories,
        confirm: true,
        include: true,
        toId: toId,
      });
    } else {
      let initialValues = { ...currentRow };
      initialValues.accountId = currentRow.account.id;
      initialValues.toId = currentRow.to ? currentRow.to.id : null;
      initialValues.payeeId = currentRow.payee ? currentRow.payee.id : null;
      initialValues.tags = currentRow.tags ? currentRow.tags.map((item) => item.tag.id) : null;
      if (action !== 2) {
        initialValues.notes = null;
        initialValues.createTime = moment();
        initialValues.confirm = true;
        initialValues.include = true;
      }
      if (action === 4) {
        if (initialValues.categories) {
          initialValues.categories.forEach((value) => {
            value.amount = value.amount * -1;
            value.convertedAmount = value.convertedAmount * -1;
          });
        }
      }
      setInitialValues(initialValues);
      setAccountCurrencyCode(currentRow.account.currencyCode);
      if (currentRow.to) setToAccountCurrencyCode(currentRow.to.currencyCode);
      setTabKey(currentRow.type);
    }
  }, [action, tabKey, currentRow]);

  const [accountCurrencyCode, setAccountCurrencyCode] = useState();
  const [toAccountCurrencyCode, setToAccountCurrencyCode] = useState();
  const accountChangeHandler = (_, option) => {
    setAccountCurrencyCode(option.currencyCode);
  };
  const toAccountChangeHandler = (_, option) => {
    setToAccountCurrencyCode(option.currencyCode);
  };
  const [isConvert, setIsConvert] = useState(false);
  const [convertCode, setConvertCode] = useState('');
  useEffect(() => {
    if (accountCurrencyCode) {
      if (tabKey === 'EXPENSE') {
        setIsConvert(accountCurrencyCode !== initialState.currentBook.defaultCurrencyCode);
        setConvertCode(initialState.currentBook.defaultCurrencyCode);
      } else if (tabKey === 'INCOME') {
        setIsConvert(accountCurrencyCode !== initialState.currentBook.defaultCurrencyCode);
        setConvertCode(initialState.currentBook.defaultCurrencyCode);
      } else if (tabKey === 'TRANSFER') {
        if (toAccountCurrencyCode) {
          setIsConvert(accountCurrencyCode !== toAccountCurrencyCode);
          setConvertCode(toAccountCurrencyCode);
        } else {
          setIsConvert(false);
        }
      }
    } else {
      setIsConvert(false);
    }
  }, [tabKey, accountCurrencyCode, toAccountCurrencyCode]);

  const successHandler = () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    if (values.tags) values.tags = values.tags.map((i) => i?.value || i);
    if (action !== 2) {
      await create('balance-flows', values);
    } else {
      //优化
      if (isEqual(currentRow.categories, values.categories)) {
        delete values.categories;
      }
      if (
        isEqual(
          currentRow.tags.map((i) => i.tag.id),
          values.tags,
        )
      ) {
        delete values.tags;
      }
      await update('balance-flows', currentRow.id, values);
    }
  };

  const items = [
    {
      key: 'EXPENSE',
      label: t('add') + t('expense'),
    },
    {
      key: 'INCOME',
      label: t('add') + t('income'),
    },
    {
      key: 'TRANSFER',
      label: t('add') + t('transfer'),
    },
  ];

  const title = () => {
    if (action === 1) {
      return <Tabs activeKey={tabKey} items={items} onChange={(value) => setTabKey(value)} />;
    } else {
      let title = '';
      if (action === 2) title = t('update');
      else if (action === 3) title = t('copy');
      else if (action === 4) title = t('refund');
      switch (currentRow.type) {
        case 'EXPENSE':
          title += t('expense');
          break;
        case 'INCOME':
          title += t('income');
          break;
        case 'TRANSFER':
          title += t('transfer');
          break;
        case 'ADJUST':
          title += t('adjust.balance');
          break;
      }
      return title;
    }
  };

  const categoryLabelMsg = t('flow.label.category');
  const amountLabelMsg = t('flow.label.amount');
  const convertCurrencyMsg = t('convertCurrency');
  return (
    <>
      <MyModalForm
        width={720}
        title={title()}
        labelWidth={80}
        params={{ type: tabKey }}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormDateTimePicker
          name="createTime"
          format="YYYY-MM-DD HH:mm"
          label={t('flow.label.createTime')}
          allowClear={false}
          rules={requiredRules()}
        />
        <ProFormSelect
          name="accountId"
          label={
            tabKey !== 'TRANSFER' ? t('flow.label.account') : t('flow.label.transfer.from.account')
          }
          rules={requiredRules()}
          onChange={accountChangeHandler}
          fieldProps={{
            options: accountOptions,
            loading: accountsLoading,
            showSearch: true,
            allowClear: false,
          }}
        />
        {tabKey === 'TRANSFER' && (
          <>
            <ProFormSelect
              name="toId"
              label={t('flow.label.transfer.to.account')}
              rules={requiredRules()}
              onChange={toAccountChangeHandler}
              fieldProps={{
                options: accounts.filter(i => i.canTransferTo),
                loading: accountsLoading,
                showSearch: true,
                allowClear: false,
              }}
            />
            <ProFormText name="amount" label={t('flow.label.amount')} rules={requiredRules()} />
            {isConvert && (
              <ProFormText
                name="convertedAmount"
                label={convertCurrencyMsg + convertCode}
                rules={requiredRules()}
              />
            )}
          </>
        )}
        {tabKey !== 'TRANSFER' && (
          <Col span={24}>
            <Form.List name="categories">
              {(fields, { add, remove }) =>
                fields.map((field) => (
                  <Row key={field.key} gutter={8} style={{ alignItems: 'baseline' }}>
                    <Col flex="auto">
                      <ProFormTreeSelect
                        name={[field.name, 'categoryId']}
                        label={categoryLabelMsg}
                        rules={requiredRules()}
                        fieldProps={{
                          loading: categoriesLoading,
                          options: categoryOptions,
                          ...treeSelectSingleProp,
                        }}
                      />
                    </Col>
                    <Col flex="190px">
                      <ProFormText
                        name={[field.name, 'amount']}
                        label={amountLabelMsg}
                        rules={requiredRules()}
                        labelCol={{ span: 8 }}
                      />
                    </Col>
                    {isConvert && (
                      <Col flex="195px">
                        <ProFormText
                          name={[field.name, 'convertedAmount']}
                          label={convertCurrencyMsg + convertCode}
                          rules={requiredRules()}
                          labelCol={{ span: 10 }}
                        />
                      </Col>
                    )}
                    <Col flex="25px">
                      <Space>
                        <PlusCircleOutlined onClick={() => add()} />
                        {fields.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        ) : null}
                      </Space>
                    </Col>
                  </Row>
                ))
              }
            </Form.List>
          </Col>
        )}
        {tabKey !== 'TRANSFER' && (
          <ProFormSelect
            name="payeeId"
            label={t('flow.label.payee')}
            fieldProps={{
              options: payeeOptions,
              loading: payeesLoading,
              showSearch: true
            }}
          />
        )}
        <ProFormTreeSelect
          name="tags"
          label={t('flow.label.tag')}
          fieldProps={{
            loading: tagsLoading,
            options: tagOptions,
            ...treeSelectMultipleProp,
          }}
        />
        <ProFormSwitch
          disabled={action === 2}
          name="confirm"
          label={t('flow.label.confirm')}
          colProps={{ xl: 6 }}
        />
        {tabKey !== 'TRANSFER' && (
          <ProFormSwitch name="include" label={t('flow.label.include')} colProps={{ xl: 6 }} />
        )}
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
