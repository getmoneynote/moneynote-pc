import {useEffect, useState, useMemo, useRef} from 'react';
import {Button, Col, Form, Input, Row, Space, Tabs, Tooltip} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined, CalculatorOutlined} from '@ant-design/icons';
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
import {dateFormatStr1, translateAction, translateFlowType} from '@/utils/util';
import { queryAll, create, update } from '@/services/common';
import {rate} from "@/services/currency";
import { treeSelectSingleProp, treeSelectMultipleProp, selectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import PayeeInput from "./PayeeInput";
import AddTagModal from './AddTagModal';
import AddPayeeModal from './AddPayeeModal';
import t from '@/utils/i18n';

export default ({ initType = 'EXPENSE' }) => {

  const { actionRef } = useModel('BalanceFlow.model');
  const formRef = useRef();
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
  }), { manual: true });

  const { data : toAccounts = [], loading : toAccountsLoading, run : loadToAccounts} = useRequest(() => queryAll('accounts', {
    'canTransferTo': tabKey === 'TRANSFER' ? true : null,
  }), { manual: true });

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => queryAll('categories', {
    'bookId': currentBook.id,
    'type': tabKey,
  }), { manual: true });

  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => queryAll('tags', {
    'bookId': currentBook.id,
    'canExpense': tabKey === 'EXPENSE' ? true : null,
    'canIncome': tabKey === 'INCOME' ? true : null,
    'canTransfer': tabKey === 'TRANSFER' ? true : null,
  }), { manual: true });

  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => queryAll('books'), { manual: true });

  const [account, setAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (!visible) return;
    if (action === 1) {
      // if (!currentBook) return;
      let initAccount;
      let initToAccount;
      let categories = [{}];
      if (tabKey === 'EXPENSE') {
        initAccount = currentBook.defaultExpenseAccount;
        setAccount(currentBook.defaultExpenseAccount);
        if (currentBook.defaultExpenseCategory) {
          categories = [{category: currentBook.defaultExpenseCategory}];
        }
      } else if (tabKey === 'INCOME') {
        initAccount = currentBook.defaultIncomeAccount;
        setAccount(currentBook.defaultIncomeAccount);
        if (currentBook.defaultIncomeCategory) {
          categories = [{ category: currentBook.defaultIncomeCategory }];
        }
      } else if (tabKey === 'TRANSFER') {
        initAccount = currentBook.defaultTransferFromAccount;
        initToAccount = currentBook.defaultTransferToAccount;
        setAccount(currentBook.defaultTransferFromAccount);
        setToAccount(currentBook.defaultTransferToAccount);
      }
      setInitialValues({
        book: currentBook,
        createTime: moment(),
        account: initAccount, //account 和 to是受控组件。
        categories: categories,
        confirm: true,
        include: true,
        to: initToAccount,
      });
    } else {
      setAccount(currentRow.account);
      setToAccount(currentRow.to);
      // 一定要深度复制
      let initialValues = JSON.parse(JSON.stringify(currentRow));
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
  }, [action, tabKey, currentRow, currentBook, visible]);

  const currencyConvert = useMemo(() => {
    if (!account) {
      return { 'needConvert': false };
    }
    if (tabKey === 'EXPENSE' || tabKey === 'INCOME') {
      return {
        'needConvert': account.currencyCode !== currentBook.defaultCurrencyCode,
        'convertCode': currentBook.defaultCurrencyCode
      }
    } else if (tabKey === 'TRANSFER') {
      if (!toAccount) {
        return { 'needConvert': false };
      }
      return {
        'needConvert': account.currencyCode !== toAccount?.currencyCode,
        'convertCode': toAccount.currencyCode
      }
    }
  }, [tabKey, account?.currencyCode, toAccount?.currencyCode, currentBook.defaultCurrencyCode]);

  // 需要转换汇率，请求rate接口
  const { data : currencyRate, loading: currencyRateLoading, run: loadCurrencyRate } = useRequest(() => rate(account.currencyCode, currencyConvert.convertCode), { manual: true });
  useEffect(() => {
    if (currencyConvert.needConvert) {
      loadCurrencyRate();
    }
  }, [tabKey, account?.currencyCode, toAccount?.currencyCode, currentBook.defaultCurrencyCode])
  function rateClickHandler(field) {
    let newValues = JSON.parse(JSON.stringify(formRef.current?.getFieldsValue()));
    let newCategory = newValues.categories[field.key];
    if (newCategory?.amount && Number(newCategory.amount) !== 0) {
      newValues.categories[field.key] = {
        ...newValues.categories[field.key],
        convertedAmount: (currencyRate * Number(newCategory.amount)).toFixed(2),
      }
    }
    formRef.current?.setFieldsValue({
      categories: newValues.categories
    });
  }


  const successHandler = () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    // values.tags里面的数据带了label labelInValue
    if (form.tags) {
      form.tags = form.tags.map((i) => i?.value || i);
    }
    form.book = form.book.value;
    form.account = form.account?.value;
    form.payee = form.payee?.value;
    form.to = form.to?.value;
    if (form.categories) {
      form.categories = form.categories.map((e) => ({
        ...e,
        'category': e.category.value,
      }));
    }
    if (action !== 2) {
      await create('balance-flows', form);
    } else {
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
      // TODO @name@code
      return translateAction(action) + translateFlowType(currentRow.type);
    }
  };

  const categoryLabelMsg = t('flow.label.category');
  const amountLabelMsg = t('flow.label.amount');
  const convertCurrencyMsg = t('convertCurrency', {code: currencyConvert.convertCode});
  const placeholderRefundMsg = t('placeholder.negative.refund');
  const currencyTooltipMsg = t('flow.currency.auto.tooltip', {rate: currencyRate})
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
        formRef={formRef}
      >
        <ProFormSelect
          name="book"
          label={t('flow.label.book')}
          rules={requiredRules()}
          onChange={ (_, option) => setCurrentBook(option) }
          disabled={action !== 1}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadBooks,
            options: books,
            loading: booksLoading,
            allowClear: false,
          }}
        />
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormDateTimePicker
          name="createTime"
          format={dateFormatStr1()}
          label={t('flow.label.createTime')}
          allowClear={false}
          rules={requiredRules()}
        />
        <ProFormSelect
          name="account"
          label={ tabKey !== 'TRANSFER' ? t('flow.label.account') : t('flow.label.transfer.from.account') }
          rules={ tabKey === 'TRANSFER' ? requiredRules() : null }
          onChange={ (_, option) => setAccount(option) }
          disabled={action === 2}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadAccounts,
            options: accounts,
            loading: accountsLoading,
          }}
        />
        {tabKey === 'TRANSFER' && (
          <>
            <ProFormSelect
              name="to"
              label={t('flow.label.transfer.to.account')}
              rules={requiredRules()}
              onChange={ (_, option) => setToAccount(option) }
              disabled={action === 2}
              fieldProps={{
                ...selectSingleProp,
                onFocus: loadToAccounts,
                options: toAccounts,
                loading: toAccountsLoading,
                allowClear: false,
              }}
            />
            <ProFormText
              name="amount"
              label={t('flow.label.amount')}
              rules={requiredRules()}
              disabled={action === 2}
            />
            {currencyConvert.needConvert && (
              <ProFormText
                name="convertedAmount"
                label={convertCurrencyMsg}
                rules={requiredRules()}
                disabled={action === 2}
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
                        }}
                        disabled={action === 2}
                      />
                    </Col>
                    <Col flex="210px">
                      <ProFormText
                        name={[field.name, 'amount']}
                        label={amountLabelMsg}
                        rules={requiredRules()}
                        labelCol={{ span: 9 }}
                        placeholder={placeholderRefundMsg}
                        disabled={action === 2}
                      />
                    </Col>
                    {currencyConvert.needConvert && (
                      <Col flex="210px">
                        <Space.Compact>
                          <Form.Item
                            name={[field.name, 'convertedAmount']}
                            label={convertCurrencyMsg}
                            rules={requiredRules()}
                            labelCol={{ span: 10 }}
                          >
                              <Input disabled={action === 2} />
                          </Form.Item>
                          <Tooltip title={currencyTooltipMsg}>
                            <Button disabled={action === 2} onClick={() => rateClickHandler(field)} loading={currencyRateLoading} size="small" type="primary" icon={<CalculatorOutlined /> } />
                          </Tooltip>
                        </Space.Compact>
                      </Col>
                    )}
                    <Col flex="25px">
                    {action !== 2 && (
                      <Space>
                        <PlusCircleOutlined onClick={() => add()} />
                        {fields.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        ) : null}
                      </Space>
                    )}
                    </Col>
                  </Row>
                ))
              }
            </Form.List>
          </Col>
        )}
        {tabKey !== 'TRANSFER' && (
          <Col span={24}>
            <Row>
              <Col flex="auto">
                <PayeeInput currentBook={currentBook} tabKey={tabKey} formRef={formRef} />
              </Col>
              <Col flex="50px">
                <AddPayeeModal book={currentBook} type={tabKey} />
              </Col>
            </Row>
          </Col>
        )}
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <ProFormTreeSelect
                name="tags"
                label={t('flow.label.tag')}
                fieldProps={{
                  ...treeSelectMultipleProp,
                  onFocus: loadTags,
                  loading: tagsLoading,
                  options: tags,
                }}
              />
            </Col>
            <Col flex="50px">
              <AddTagModal book={currentBook} type={tabKey} />
            </Col>
          </Row>
        </Col>
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
