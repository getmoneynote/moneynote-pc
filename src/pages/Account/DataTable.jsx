import { useState } from 'react';
import {Alert, Button, Form, Input, Space} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import {useModel, useRequest, history} from '@umijs/max';
import {queryAll, query1, toggle} from '@/services/common';
import {
  statistics,
  toggleCanExpense,
  toggleCanIncome,
  toggleCanTransferFrom,
  toggleCanTransferTo,
  toggleInclude,
} from '@/services/account';
import { refresh } from "@/services/currency";
import MySwitch from '@/components/MySwitch';
import TrashButton from '@/components/TrashButton';
import {selectSingleProp, tableProp} from '@/utils/prop';
import { tableSortFormat } from '@/utils/util';
import ActionForm from './ActionForm';
import AdjustForm from './AdjustForm';
import t from '@/utils/i18n';


export default ({ type, actionRef }) => {

  const { initialState } = useModel('@@initialState');
  const { show } = useModel('modal');
  const [statisticsData, setStatisticsData] = useState([0, 0, 0]);

  const { data : currencyOptions = [], loading : currencyLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const { loading : refreshCurrencyLoading, run : runRefreshCurrency} = useRequest(refresh, { manual: true });

  function successHandler() {
    actionRef.current?.reload();
  }

  const trashHandler = async (record) => {
    await toggle('accounts', record.id);
    successHandler();
  };

  const addHandler = () => {
    show(<ActionForm type={type} actionRef={actionRef} />);
  };

  const updateHandler = (record) => {
    show(<ActionForm type={type} actionRef={actionRef} />, 2, record);
  };

  const adjustHandler = (record) => {
    show(<AdjustForm actionRef={actionRef} />, 1, record);
  };

  function columnRender() {
    let columns = [
      {
        title: t('label.name'),
        dataIndex: 'name',
      },
      {
        title: t('account.label.balance'),
        dataIndex: 'balance',
        sorter: true,
        search: { transform: (_) => null },
        renderFormItem: () => {
          return (
            <Space>
              <span>
                <Form.Item name="minBalance" noStyle={true}>
                  <Input style={{ width: '43%' }} />
                </Form.Item>
                <span> — </span>
                <Form.Item name="maxBalance" noStyle={true}>
                  <Input style={{ width: '43%' }} />
                </Form.Item>
              </span>
            </Space>
          );
        },
      },
      {
        title: t('account.label.currencyCode'),
        dataIndex: 'currencyCode',
        sorter: true,
        valueType: 'select',
        fieldProps: {
          ...selectSingleProp,
          options: currencyOptions,
          loading: currencyLoading,
          onFocus: loadCurrencies,
          labelInValue: false,
        },
      },
      {
        title: t('sort'),
        dataIndex: 'sort',
        sorter: true,
        hideInSearch: true,
      },
    ];

    if (type === 'CREDIT') {
      columns = columns.concat([
        {
          title: t('account.label.credit.limit'),
          dataIndex: 'creditLimit',
          sorter: true,
          hideInSearch: true,
        },
        {
          title: t('account.label.credit.remain'),
          dataIndex: 'remainLimit',
          hideInSearch: true,
        },
        {
          title: t('account.label.bill.day'),
          dataIndex: 'billDay',
          sorter: true,
          hideInSearch: true,
        },
      ]);
    }

    if (type === 'DEBT') {
      columns = columns.concat([
        {
          title: t('account.label.credit.limit'),
          dataIndex: 'creditLimit',
          sorter: true,
          hideInSearch: true,
        },
        {
          title: t('account.label.credit.remain'),
          dataIndex: 'remainLimit',
          hideInSearch: true,
        },
        {
          title: t('account.label.apr'),
          dataIndex: 'apr',
          hideInSearch: true,
        },
        {
          title: t('account.label.bill.day.debt'),
          dataIndex: 'billDay',
          hideInSearch: true,
        },
      ]);
    }

    columns = columns.concat([
      {
        title: t('operation'),
        align: 'center',
        hideInSearch: true,
        render: (_, record) => [
          <Button type="link" onClick={() => {
            history.push(
              {
                pathname: '/statement',   //要跳转的路由
              },
              {
                account: record
              }
            )
          }}>
            {t('account.audit')}
          </Button>,
          <Button type="link" onClick={() => updateHandler(record)}>
            {t('update')}
          </Button>,
          <TrashButton onClick={() => trashHandler(record)} />,
          <Button type="link" onClick={() => adjustHandler(record)}>
            {t('adjust.balance')}
          </Button>,
        ],
      },
      {
        title: t('account.label.include'),
        dataIndex: 'include',
        sorter: true,
        valueType: 'select',
        fieldProps: {
          options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ],
        },
        render: (_, record) => (
          <MySwitch
            value={record.include}
            request={() => toggleInclude(record.id)}
            onSuccess={successHandler}
          />
        ),
      },
      {
        title: t('label.canExpense'),
        dataIndex: 'canExpense',
        sorter: true,
        valueType: 'select',
        fieldProps: {
          options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ],
        },
        render: (_, record) => (
          <MySwitch
            value={record.canExpense}
            request={() => toggleCanExpense(record.id)}
            onSuccess={successHandler}
          />
        ),
      },
      {
        title: t('label.canIncome'),
        dataIndex: 'canIncome',
        sorter: true,
        valueType: 'select',
        fieldProps: {
          options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ],
        },
        render: (_, record) => (
          <MySwitch
            value={record.canIncome}
            request={() => toggleCanIncome(record.id)}
            onSuccess={successHandler}
          />
        ),
      },
      {
        title: t('account.label.canTransferFrom'),
        dataIndex: 'canTransferFrom',
        sorter: true,
        valueType: 'select',
        fieldProps: {
          options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ],
        },
        render: (_, record) => (
          <MySwitch
            value={record.canTransferFrom}
            request={() => toggleCanTransferFrom(record.id)}
            onSuccess={successHandler}
          />
        ),
      },
      {
        title: t('account.label.canTransferTo'),
        dataIndex: 'canTransferTo',
        sorter: true,
        valueType: 'select',
        fieldProps: {
          options: [
            { label: t('yes'), value: true },
            { label: t('no'), value: false },
          ],
        },
        render: (_, record) => (
          <MySwitch
            value={record.canTransferTo}
            request={() => toggleCanTransferTo(record.id)}
            onSuccess={successHandler}
          />
        ),
      },
    ]);

    return columns;
  }

  function extraRender() {
    let message = `${t('total.balance')}(${initialState.currentGroup.defaultCurrencyCode}): ${statisticsData[0]}`;
    if (type === 'CREDIT' || type === 'DEBT') {
      const totalLimit = `${t('total.limit')}(${initialState.currentGroup.defaultCurrencyCode}): ${statisticsData[1]}`;
      const totalRemain = `${t('total.remain.limit')}(${initialState.currentGroup.defaultCurrencyCode}): ${statisticsData[2]}`;
      message = (
        <span>
          {message}&nbsp;&nbsp;&nbsp;&nbsp;{totalLimit}&nbsp;&nbsp;&nbsp;&nbsp;{totalRemain}
        </span>
      );
    }
    return <Alert type="info" showIcon message={message} />;
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
    let noItem = null;
    if (record.no) {
      noItem = (
        <span>
          {t('account.label.no')}: {record.no}
        </span>
      );
    }
    let currencyItem = null;
    if (initialState.currentGroup.defaultCurrencyCode !== record.currencyCode) {
      currencyItem = (
        <span>
          {t('convertCurrency', {code: initialState.currentGroup.defaultCurrencyCode})}: {record.convertedBalance},&nbsp;&nbsp;&nbsp;
          {t('account.rate')}：{record.rate}
        </span>
      );
    }
    if (notesItem || noItem || currencyItem) {
      return (
        <>
          {currencyItem}
          <span>&nbsp;&nbsp;</span>
          {noItem}
          <span>&nbsp;&nbsp;</span>
          {notesItem}
        </>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <ProTable
        {...tableProp}
        actionRef={actionRef}
        tableExtraRender={extraRender}
        toolBarRender={() => [
          <Button type="primary" onClick={runRefreshCurrency} loading={refreshCurrencyLoading}>
            {t('account.refresh.currency')}
          </Button>,
          <Button type="primary" onClick={addHandler}>
            <PlusOutlined />
            {t('add')}
          </Button>,
        ]}
        columns={columnRender()}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          rowExpandable: (record) => expandedRowRender(record),
        }}
        params={{ type: type, deleted: false, }}
        request={(params = {}, sort, _) => {
          statistics(params).then((res) => {
            setStatisticsData(res.data);
          });
          return query1('accounts', { ...params, ...{ sort: tableSortFormat(sort) } });
        }}
      />
    </>
  );
};
