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
import { isEqual, translateAction, translateFlowType } from '@/utils/util';
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
  const [currentBook, setCurrentBook] = useState(initialState.currentBook);
  // 确保每次新增都是默认账单，修复先点击复制，之后再新增，遗留之前的数据。
  useEffect(() => {
    if (action === 1) {
      setCurrentBook(initialState.currentBook);
      setTabKey('EXPENSE');
    } else {
      setCurrentBook(currentRow.book);
      setTabKey(currentRow.type);
    }
  }, [action, currentRow]);

  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => getAll('accounts'), { manual: true });
  const accountOptions = useMemo(() => {
    let options = [];
    if (tabKey === 'EXPENSE') {
      options = accounts.filter(i => i.canExpense);
      if (action === 1) {
        if (currentBook.defaultExpenseAccount) {
          if (!options.some(e => e.id === currentBook.defaultExpenseAccount.id)) {
            options.unshift(currentBook.defaultExpenseAccount);
          }
        }
      }
    }
    if (tabKey === 'INCOME') {
      options = accounts.filter(i => i.canIncome);
      if (action === 1) {
        if (currentBook.defaultIncomeAccount) {
          if (!options.some(e => e.id === currentBook.defaultIncomeAccount.id)) {
            options.unshift(currentBook.defaultIncomeAccount);
          }
        }
      }
    }
    if (tabKey === 'TRANSFER') {
      options = accounts.filter(i => i.canTransferFrom);
      if (action === 1) {
        if (currentBook.defaultTransferFromAccount) {
          if (!options.some(e => e.id === currentBook.defaultTransferFromAccount.id)) {
            options.unshift(currentBook.defaultTransferFromAccount);
          }
        }
      }
    }
    if (action !== 1) {
      if (!options.some(e => e.id === currentRow.account.id)) {
        options.unshift(currentRow.account);
      }
    }
    return options;
  }, [tabKey, accounts, action, currentBook, currentRow]);
  const toAccountOptions = useMemo(() => {
    let options = [];
    if (tabKey === 'TRANSFER') {
      options = accounts.filter(i => i.canTransferTo)
      if (action === 1) {
        if (currentBook.defaultTransferToAccount) {
          if (!options.some(e => e.id === currentBook.defaultTransferToAccount.id)) {
            options.unshift(currentBook.defaultTransferToAccount);
          }
        }
      }
    }
    if (action !== 1 && currentRow.to) {
      if (!options.some(e => e.id === currentRow.to.id)) {
        options.unshift(currentRow.to);
      }
    }
    return options;
  }, [tabKey, accounts, action, currentBook, currentRow]);

  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(() => getAll('payees', currentBook.id), { manual: true });
  const payeeOptions = useMemo(() => {
    let options = [];
    if (tabKey === 'EXPENSE') {
      options = payees.filter(i => i.canExpense);
    }
    if (tabKey === 'INCOME') {
      options = payees.filter(i => i.canIncome);
    }
    if (action !== 1 && currentRow.payee) {
      if (!options.some(e => e.id === currentRow.payee.id)) {
        options.unshift(currentRow.payee);
      }
    }
    return options;
  }, [tabKey, payees, action, currentRow]);

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => getAll('categories', currentBook.id), { manual: true });
  const categoryOptions = useMemo(() => {
    let options = [];
    if (tabKey === 'EXPENSE') {
      options = categories.filter(i => i.canExpense);
      // 新增时，默认的支出类别可能已禁用，需要处理。
      if (action === 1) {
        if (currentBook.defaultExpenseCategory) {
          if (!options.some(e => e.id === currentBook.defaultExpenseCategory.id)) {
            options.unshift(currentBook.defaultExpenseCategory);
          }
        }
      }
    }
    if (tabKey === 'INCOME') {
      options = categories.filter(i => i.canIncome);
      if (action === 1) {
        if (currentBook.defaultIncomeCategory) {
          if (!options.some(e => e.id === currentBook.defaultIncomeCategory.id)) {
            options.unshift(currentBook.defaultIncomeCategory);
          }
        }
      }
    }
    if (action !== 1) {
      currentRow.categories.forEach(e => {
        if (!options.some(e1 => e1.id === e.category.id)) {
          options.unshift(e.category);
        }
      });
    }
    return options;
  }, [tabKey, categories, action, currentBook, currentRow]);

  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => getAll('tags', currentBook.id), { manual: true });
  const tagOptions = useMemo(() => {
    let options = [];
    if (tabKey === 'EXPENSE') {
      options = tags.filter(i => i.canExpense);
    }
    if (tabKey === 'INCOME') {
      options = tags.filter(i => i.canIncome);
    }
    if (tabKey === 'TRANSFER') {
      options = tags.filter(i => i.canTransfer);
    }
    if (action !== 1 && currentRow.tags) {
      currentRow.tags.forEach(e => {
        if (!options.some(e1 => e1.id === e.tag.id)) {
          options.unshift(e.tag);
        }
      });
    }
    return options;
  }, [tabKey, tags, action, currentRow]);

  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => getAll('books'), { manual: true });
  const bookOptions = useMemo(() => {
    let options = books;
    if (action !== 1 && currentRow.book) {
      if (!options.some(e => e.id === currentRow.book.id)) {
        options.unshift(currentRow.book);
      }
    }
    return options;
  }, [books, action, currentRow]);

  // 为了解决默认值的问题，加visible是为了每次打开都重新加载。
  useEffect(() => {
    if (visible) {
      loadAccounts();
      loadBooks();
    }
  }, [visible]);
  useEffect(() => {
    if (visible && currentBook) {
      loadCategories();
      loadPayees();
      loadTags();
    }
  }, [visible, currentBook]);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      // if (!currentBook) return;
      let accountId = null;
      let categories = [{}];
      let toId = null;
      if (tabKey === 'EXPENSE') {
        accountId = currentBook.defaultExpenseAccount?.id;
        if (currentBook.defaultExpenseCategory) {
          categories = [{ categoryId: currentBook.defaultExpenseCategory.id }];
        }
      } else if (tabKey === 'INCOME') {
        accountId = currentBook.defaultIncomeAccount?.id;
        if (currentBook.defaultIncomeCategory) {
          categories = [{ categoryId: currentBook.defaultIncomeCategory.id }];
        }
      } else if (tabKey === 'TRANSFER') {
        accountId = currentBook.defaultTransferFromAccount?.id;
        toId = currentBook.defaultTransferToAccount?.id;
      }
      setInitialValues({
        bookId: currentBook.id,
        createTime: moment(),
        accountId: accountId,
        categories: categories,
        confirm: true,
        include: true,
        toId: toId,
      });
    } else {
      // let initialValues = structuredClone(currentRow);
      let initialValues = JSON.parse(JSON.stringify(currentRow));
      initialValues.bookId = initialValues.book.id;
      initialValues.accountId = initialValues.account.id;
      initialValues.toId = initialValues.to?.id;
      initialValues.payeeId = initialValues.payee?.id;
      initialValues.tags = initialValues.tags ? initialValues.tags.map((item) => item.tag.id) : null;
      if (action !== 2) {
        initialValues.notes = null;
        initialValues.createTime = moment();
        initialValues.confirm = true;
        initialValues.include = true;
      }
      if (action === 4) {
        if (initialValues.type === 'EXPENSE' || initialValues.type === 'INCOME') {
          if (initialValues.categories) {
            initialValues.categories.forEach((element) => {
              element.amount = element.amount * -1;
              element.convertedAmount = element.convertedAmount * -1;
            });
          }
        } else { //转账
          initialValues.amount = initialValues.amount * -1;
          initialValues.convertedAmount = initialValues.convertedAmount * -1;
        }
      }
      setInitialValues(initialValues);
    }
  }, [action, tabKey, currentRow, currentBook]);

  const [accountCurrencyCode, setAccountCurrencyCode] = useState();
  const [toAccountCurrencyCode, setToAccountCurrencyCode] = useState();
  useEffect(() => {
    if (action === 1) {
      if (tabKey === 'EXPENSE') {
        setAccountCurrencyCode(currentBook.defaultExpenseAccount?.currencyCode);
      } else if (tabKey === 'INCOME') {
        setAccountCurrencyCode(currentBook.defaultIncomeAccount?.currencyCode);
      } else if (tabKey === 'TRANSFER') {
        setAccountCurrencyCode(currentBook.defaultTransferFromAccount?.currencyCode);
        setToAccountCurrencyCode(currentBook.defaultTransferToAccount?.currencyCode);
      }
    } else {
      setAccountCurrencyCode(currentRow.account.currencyCode);
      setToAccountCurrencyCode(currentRow.to?.currencyCode);
    }
  }, [action, tabKey, currentRow, currentBook]);
  const accountChangeHandler = (_, option) => {
    setAccountCurrencyCode(option.currencyCode);
  };
  const toAccountChangeHandler = (_, option) => {
    setToAccountCurrencyCode(option.currencyCode);
  };
  const [isConvert, setIsConvert] = useState(false);
  const [convertCode, setConvertCode] = useState('');
  useEffect(() => {
    if (!accountCurrencyCode) return;
    if (tabKey === 'EXPENSE') {
      setIsConvert(accountCurrencyCode !== currentBook.defaultCurrencyCode);
      setConvertCode(currentBook.defaultCurrencyCode);
    } else if (tabKey === 'INCOME') {
      setIsConvert(accountCurrencyCode !== currentBook.defaultCurrencyCode);
      setConvertCode(currentBook.defaultCurrencyCode);
    } else if (tabKey === 'TRANSFER') {
      if (toAccountCurrencyCode) {
        setIsConvert(accountCurrencyCode !== toAccountCurrencyCode);
        setConvertCode(toAccountCurrencyCode);
      } else {
        setIsConvert(false);
      }
    }
  }, [tabKey, accountCurrencyCode, toAccountCurrencyCode, currentBook]);

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
      return translateAction(action) + translateFlowType(currentRow.type);
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
        <ProFormSelect
          name="bookId"
          label={t('flow.label.book')}
          rules={requiredRules()}
          onChange={(_, option) => {
            setCurrentBook(option);
          }}
          disabled={action !== 1}
          fieldProps={{
            options: bookOptions,
            loading: booksLoading,
            showSearch: true,
            allowClear: false,
          }}
        />
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
                options: toAccountOptions,
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
        <ProFormSwitch name="include" label={t('flow.label.include')} colProps={{ xl: 6 }} />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
