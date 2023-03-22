import { useState } from 'react';
import { Alert, Button, Dropdown, Form, Input, message, Modal, Space, Tag, Tooltip } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import {useModel, useRequest} from '@umijs/max';
import moment from 'moment';
import { confirm, query, remove, statistics } from '@/services/flow';
import { getAll as getAllAccount } from '@/services/account';
import { getAll as getAllPayee } from '@/services/payee';
import { getAll as getAllCategory } from '@/services/category';
import { getAll as getAllTag } from '@/services/tag';
import { getAll as getAllBook } from '@/services/book';
import { useMsg } from '@/utils/hooks';
import { selectSearchProp, tableProp, treeSelectMultipleProp } from '@/utils/prop';
import { tableSortFormat } from '@/utils/util';
import ActionForm from './ActionForm';
import TagForm from './TagForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('BalanceFlow.model');
  const { initialState } = useModel('@@initialState');
  const { show } = useModel('modal');
  const { successMsg } = useMsg();

  const { data : accounts = [], loading : accountsLoading, run : loadAccounts} = useRequest(getAllAccount, { manual: true });
  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(getAllCategory, { manual: true });
  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(getAllTag, { manual: true });
  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(getAllPayee, { manual: true });
  const { data : books = [], loading : booksLoading} = useRequest(getAllBook);

  const [statisticsData, setStatisticsData] = useState([0, 0, 0]);

  function successHandler() {
    message.success(successMsg);
    actionRef.current?.reload();
  }

  const addHandler = () => {
    show(<ActionForm />);
  };

  function copyHandler(record) {
    show(<ActionForm />, 3, record);
  }

  const updateHandler = (record) => {
    show(<ActionForm />, 2, record);
  };

  const refundHandler = (record) => {
    show(<ActionForm />, 4, record);
  };

  const confirmHandler = async (record) => {
    await confirm(record.id);
    successHandler();
  };

  const updateTagAmountHandler = (record, relation) => {
    show(<TagForm flow={record} />, 2, relation);
  };

  const messageDeleteConfirm = t('delete.confirm', { name: '' });
  const messageDeleteConfirmBalance = t('delete.confirm.balance');
  const deleteHandler = (record) => {
    Modal.confirm({
      title: record.confirm ? messageDeleteConfirmBalance : messageDeleteConfirm,
      onOk: async () => {
        await remove(record.id);
        successHandler();
      },
    });
  };

  const columns = [
    {
      title: t('flow.label.book'),
      dataIndex: 'book',
      sorter: true,
      render: (_, record) => record.book.name,
      hideInTable: true,
      valueType: 'select',
      initialValue: initialState.currentBook.id,
      fieldProps: {
        options: books,
        loading: booksLoading,
        ...selectSearchProp,
        mode: false,
      },
    },
    {
      title: t('flow.label.title'),
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: t('flow.label.type'),
      dataIndex: 'type',
      render: (_, record) => record.typeName,
      sorter: true,
      align: 'center',
      valueType: 'select',
      // request: () => typeOptions,
      fieldProps: {
        options: [
          { label: t('expense'), value: 'EXPENSE' },
          { label: t('income'), value: 'INCOME' },
          { label: t('transfer'), value: 'TRANSFER' },
          { label: t('adjust.balance'), value: 'ADJUST' },
        ],
      },
    },
    {
      title: t('flow.label.amount'),
      dataIndex: 'amount',
      sorter: true,
      search: { transform: (_) => null },
      renderFormItem: () => {
        return (
          <Space>
            <span>
              <Form.Item name="minAmount" noStyle={true}>
                <Input style={{ width: '43%' }} />
              </Form.Item>
              <span> — </span>
              <Form.Item name="maxAmount" noStyle={true}>
                <Input style={{ width: '43%' }} />
              </Form.Item>
            </span>
          </Space>
        );
      },
    },
    {
      title: t('flow.label.createTime'),
      dataIndex: 'createTime',
      sorter: true,
      align: 'center',
      render: (_, record) => moment(record.createTime).format('YYYY-MM-DD HH:mm'),
      valueType: 'dateRange',
      search: {
        transform: (value) => ({
          minTime: moment(value[0]).startOf('day').valueOf(),
          maxTime: moment(value[1]).endOf('day').valueOf(),
        }),
      },
      fieldProps: {
        allowEmpty: [true, true],
        ranges: {
          Today: [moment().startOf('day'), moment().endOf('day')],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'This Year': [moment().startOf('year'), moment().endOf('year')],
          'Last Year': [
            moment().add(-1, 'years').startOf('year'),
            moment().add(-1, 'years').endOf('year'),
          ],
        },
      },
    },
    {
      title: t('flow.label.account'),
      dataIndex: 'account',
      sorter: true,
      render: (_, record) => record.accountName,
      valueType: 'select',
      fieldProps: {
        options: accounts,
        loading: accountsLoading,
        onFocus: loadAccounts,
        ...selectSearchProp,
        mode: false,
      },
    },
    {
      title: t('flow.label.category'),
      dataIndex: 'categories',
      render: (_, record) => record.categoryName,
      valueType: 'treeSelect',
      fieldProps: {
        options: categories,
        loading: categoriesLoading,
        onFocus: loadCategories,
        ...treeSelectMultipleProp,
      },
    },
    {
      title: t('flow.label.tag'),
      dataIndex: 'tags',
      render: (_, record) => tagColumnRender(record),
      valueType: 'treeSelect',
      fieldProps: {
        options: tags,
        loading: tagsLoading,
        onFocus: loadTags,
        ...treeSelectMultipleProp,
      },
    },
    {
      title: t('flow.label.payee'),
      dataIndex: 'payee',
      sorter: true,
      render: (_, record) => <>{record.payee ? record.payee.name : '-'}</>,
      valueType: 'select',
      search: { transform: (value) => ({ payees: value }) },
      fieldProps: {
        options: payees,
        loading: payeesLoading,
        onFocus: loadPayees,
        ...selectSearchProp,
      },
    },
    {
      title: t('flow.label.confirm'),
      dataIndex: 'confirm',
      sorter: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        true: { text: t('yes'), status: 'Success' },
        false: { text: t('no'), status: 'Error' },
      },
    },
    {
      title: t('flow.label.include'),
      dataIndex: 'include',
      sorter: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        true: { text: t('yes'), status: 'Success' },
        false: { text: t('no'), status: 'Error' },
      },
    },
    {
      title: t('operation'),
      align: 'center',
      width: 160,
      hideInSearch: true,
      fixed: 'right',
      render: (_, record) => [
        <Button type="link" disabled={record.type === 'ADJUST'} onClick={() => copyHandler(record)}>
          {t('copy')}
        </Button>,
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <Button type="text" onClick={() => updateHandler(record)}>
                    {t('update')}
                  </Button>
                ),
              },
              {
                label: (
                  <Button
                    type="text"
                    onClick={() => confirmHandler(record)}
                    disabled={record.type === 'ADJUST' || record.confirm}
                  >
                    {t('confirm')}
                  </Button>
                ),
              },
              {
                label: (
                  <Button
                    type="text"
                    onClick={() => refundHandler(record)}
                    disabled={record.type === 'ADJUST' || record.type === 'TRANSFER'}
                  >
                    {t('refund')}
                  </Button>
                ),
              },
              {
                label: (
                  <Button type="text" onClick={() => deleteHandler(record)}>
                    {t('delete')}
                  </Button>
                ),
              },
            ],
          }}
        >
          <a>
            {t('more')} <DownOutlined />
          </a>
        </Dropdown>,
      ],
    },
  ];

  function tagColumnRender(record) {
    function tagRender(relation) {
      if (record.type === 'EXPENSE' || record.type === 'INCOME') {
        return (
          <Tooltip title={`${t('flow.label.amount')}: ${relation.amount}, ${t('click.edit')}`}>
            <Tag
              onClick={() => updateTagAmountHandler(record, relation)}
              style={{ cursor: 'pointer' }}
              color="blue"
            >
              {relation.tag.name}
            </Tag>
          </Tooltip>
        );
      } else {
        return <Tag color="blue">{relation.tag.name}</Tag>;
      }
    }
    return record.tags.map((i) => tagRender(i));
  }

  function expandedRowRender(record) {
    let notesItem = null;
    if (record.notes) {
      notesItem = (
        <span>
          {t('label.notes')}: {record.notes}
        </span>
      );
    }
    let currencyItem = null;
    if (record.type === 'EXPENSE' || record.type === 'INCOME') {
      if (record.account.currencyCode !== record.book.defaultCurrencyCode) {
        currencyItem = (
          <span>
            {t('convertCurrency') + record.book.defaultCurrencyCode}: {record.convertedAmount}
          </span>
        );
      }
    } else if (record.type === 'TRANSFER') {
      if (record.account.currencyCode !== record.to.currencyCode) {
        currencyItem = (
          <span>
            {t('convertCurrency') + record.to.currencyCode}: {record.convertedAmount}
          </span>
        );
      }
    }
    if (notesItem || currencyItem) {
      return (
        <>
          {currencyItem}
          <span>&nbsp;&nbsp;</span>
          {notesItem}
        </>
      );
    } else {
      return null;
    }
  }

  function extraRender() {
    const total1 = t('flow.total.expense') + ': ' + statisticsData[0];
    const total2 = t('flow.total.income') + ': ' + statisticsData[1];
    const total3 = t('flow.total.surplus') + ': ' + statisticsData[2];
    const message = (
      <span>
        {total1}&nbsp;&nbsp;&nbsp;&nbsp;{total2}&nbsp;&nbsp;&nbsp;&nbsp;{total3}
      </span>
    );
    return <Alert type="info" showIcon message={message} />;
  }

  return (
    <>
      <ProTable
        {...tableProp}
        actionRef={actionRef}
        tableExtraRender={extraRender}
        toolBarRender={() => [
          <Button type="primary" onClick={addHandler}>
            <PlusOutlined />
            {t('add')}
          </Button>,
        ]}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          rowExpandable: (record) => expandedRowRender(record),
        }}
        request={(params = {}, sort, _) => {
          statistics(params).then((res) => {
            setStatisticsData(res.data);
          });
          return query({ ...params, ...{ sort: tableSortFormat(sort) } });
        }}
      />
    </>
  );
};
