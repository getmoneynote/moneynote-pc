import {useEffect, useState} from 'react';
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
import { queryAll, query, create, update } from '@/services/common';
import { treeSelectSingleProp, treeSelectMultipleProp, selectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ initType = 'EXPENSE' }) => {

  const { actionRef } = useModel('BalanceFlow.model');
  const { initialState } = useModel('@@initialState');
  const { action, currentRow, visible } = useModel('modal');
  const [tabKey, setTabKey] = useState(initType);
  const [currentBook, setCurrentBook] = useState(initialState.currentBook);
  // 确保每次新增都是默认账单，修复先点击复制，之后再新增，遗留之前的数据。
  useEffect(() => {
    if (!visible) return;
    if (action === 1) {
      setCurrentBook(initialState.currentBook);
      setTabKey(initType);
    } else {
      setCurrentBook(currentRow.book);
      setTabKey(currentRow.type);
    }
  }, [action, currentRow, initType, visible]);

  // 默认的支出账户不可能是禁用的。
  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(() => queryAll('accounts', {
    'canExpense': tabKey === 'EXPENSE' ? true : null,
    'canIncome': tabKey === 'INCOME' ? true : null,
    'canTransferFrom': tabKey === 'TRANSFER' ? true : null,
    // 'keep': action === 1 ? null : currentRow.account.id,
  }), { manual: true });

  const { data : toAccounts = [], loading : toAccountsLoading, run : loadToAccounts} = useRequest(() => queryAll('accounts', {
    'canTransferTo': tabKey === 'TRANSFER' ? true : null,
    // 'keep': action === 1 ? null : currentRow.to.id,
  }), { manual: true });

  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(() => queryAll('payees', {
    'bookId': currentBook.id,
    'canExpense': tabKey === 'EXPENSE' ? true : null,
    'canIncome': tabKey === 'INCOME' ? true : null,
    // 'keep': action === 1 ? null : currentRow.payee?.id,
  }), { manual: true });

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => query('categories', {
    'bookId': currentBook.id,
    'type': tabKey,
    'enable': true,
    // 'keeps': action === 1 ? [] : currentRow.categories.map(e => e.category.id),
  }), { manual: true });

  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => query('tags', {
    'bookId': currentBook.id,
    'canExpense': tabKey === 'EXPENSE' ? true : null,
    'canIncome': tabKey === 'INCOME' ? true : null,
    'canTransfer': tabKey === 'TRANSFER' ? true : null,
    'enable': true,
    // 'keeps': action === 1 ? [] : currentRow.tags.map(e => e.tag.id),
  }), { manual: true });

  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => queryAll('books'), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      // if (!currentBook) return;
      let account = null;
      let categories = [{}];
      let to = null;
      if (tabKey === 'EXPENSE') {
        account = currentBook.defaultExpenseAccount;
        if (currentBook.defaultExpenseCategory) {
          categories = [{ category: currentBook.defaultExpenseCategory }];
        }
      } else if (tabKey === 'INCOME') {
        account = currentBook.defaultIncomeAccount;
        if (currentBook.defaultIncomeCategory) {
          categories = [{ category: currentBook.defaultIncomeCategory }];
        }
      } else if (tabKey === 'TRANSFER') {
        account = currentBook.defaultTransferFromAccount;
        to = currentBook.defaultTransferToAccount;
      }
      setInitialValues({
        book: currentBook,
        createTime: moment(),
        account: account,
        categories: categories,
        confirm: true,
        include: true,
        to: to,
      });
    } else {
      // let initialValues = structuredClone(currentRow);
      // 一定要深度复制
      let initialValues = JSON.parse(JSON.stringify(currentRow));
      // initialValues.bookId = initialValues.book;
      // initialValues.accountId = initialValues.account;
      // initialValues.toId = initialValues.to;
      // initialValues.payeeId = initialValues.payee;
      initialValues.tags = initialValues.tags?.map((item) => item.tag);
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
    let form = JSON.parse(JSON.stringify(values));
    // values.tags里面的数据带了label labelInValue
    if (form.tags) {
      form.tags = form.tags.map((i) => i?.value || i);
    }
    form.bookId = form.book.value;
    delete form.book;
    form.accountId = form.account.value;
    delete form.account;
    form.payeeId = form.payee?.value;
    delete form.payee;
    form.toId = form.to?.value;
    delete form.to;
    if (form.categories) {
      console.log(form.categories);
      form.categories = form.categories.map((e) => ({
        ...e,
        'categoryId': e.category.value,
      }));
      form.categories.forEach(e => delete e.category);
    }
    if (action !== 2) {
      await create('balance-flows', form);
    } else {
      //优化
      if (isEqual(
        currentRow.categories.map(e => ({
          'categoryId': e.categoryId,
          'amount': e.amount,
          'convertedAmount': e.convertedAmount
        })),
        form.categories.map(e=>({
          'categoryId': e.categoryId,
          'amount': e.amount,
          'convertedAmount': e.convertedAmount
        }))
      )) {
        delete form.categories;
      }
      if (isEqual(currentRow.tags.map((i) => i.tag.id), form.tags)) {
        delete form.tags;
      }
      await update('balance-flows', currentRow.id, form);
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
          name="book"
          label={t('flow.label.book')}
          rules={requiredRules()}
          onChange={(_, option) => {
            setCurrentBook(option);
          }}
          disabled={action !== 1}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadBooks,
            options: books,
            loading: booksLoading,
            allowClear: false,
            labelInValue: true,
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
          name="account"
          label={
            tabKey !== 'TRANSFER' ? t('flow.label.account') : t('flow.label.transfer.from.account')
          }
          rules={requiredRules()}
          onChange={accountChangeHandler}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadAccounts,
            options: accounts,
            loading: accountsLoading,
            allowClear: false,
            labelInValue: true,
          }}
        />
        {tabKey === 'TRANSFER' && (
          <>
            <ProFormSelect
              name="to"
              label={t('flow.label.transfer.to.account')}
              rules={requiredRules()}
              onChange={toAccountChangeHandler}
              fieldProps={{
                ...selectSingleProp,
                onFocus: loadToAccounts,
                options: toAccounts,
                loading: toAccountsLoading,
                labelInValue: true,
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
                        name={[field.name, 'category']}
                        label={categoryLabelMsg}
                        rules={requiredRules()}
                        fieldProps={{
                          ...treeSelectSingleProp,
                          onFocus: loadCategories,
                          loading: categoriesLoading,
                          options: categories,
                          labelInValue: true,
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
            name="payee"
            label={t('flow.label.payee')}
            fieldProps={{
              ...selectSingleProp,
              onFocus: loadPayees,
              options: payees,
              loading: payeesLoading,
              labelInValue: true,
            }}
          />
        )}
        <ProFormTreeSelect
          name="tags"
          label={t('flow.label.tag')}
          fieldProps={{
            ...treeSelectMultipleProp,
            onFocus: loadTags,
            loading: tagsLoading,
            options: tags,
            labelInValue: true,
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
