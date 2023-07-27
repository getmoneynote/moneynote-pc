import {useRef, useState} from 'react';
import {Alert, Button, Form, Input, Modal, Space} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import {useIntl, useModel, useRequest} from '@umijs/max';
import {queryAll, remove, toggle, recover, removeSoft, query} from '@/services/common';
import {
  statistics,
  toggleCanExpense,
  toggleCanIncome,
  toggleCanTransferFrom,
  toggleCanTransferTo,
  toggleInclude,
} from '@/services/account';
import MySwitch from '@/components/MySwitch';
import {selectSingleProp, tableProp} from '@/utils/prop';
import { tableSortFormat } from '@/utils/util';
import t from '@/utils/i18n';


export default () => {

  const actionRef = useRef();

  function successHandler() {
    actionRef.current?.reload();
  }

  const recoverHandler = async (record) => {
    await recover('accounts', record.id);
    successHandler();
  };

  const intl = useIntl();
  const deleteHandler = (record) => {
    const messageDeleteConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
      { name: record.name },
    );
    Modal.confirm({
      title: messageDeleteConfirm,
      onOk: async () => {
        await remove('accounts', record.id);
        successHandler();
      },
    });
  };

  const columns = [
    {
      title: t('account.type'),
      dataIndex: 'type',
      render: (_, record) => record.typeName,
      sorter: true,
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('checking.account'), value: 'CHECKING' },
          { label: t('credit.account'), value: 'CREDIT' },
          { label: t('asset.account'), value: 'ASSET' },
          { label: t('debt.account'), value: 'DEBT' },
        ],
      },
    },
    {
      title: t('label.name'),
      dataIndex: 'name',
    },
    {
      title: t('account.label.balance'),
      dataIndex: 'balance',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: t('account.label.currencyCode'),
      dataIndex: 'currencyCode',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: t('account.label.include'),
      dataIndex: 'include',
      sorter: true,
      hideInSearch: true,
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
      hideInSearch: true,
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
      hideInSearch: true,
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
      hideInSearch: true,
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
      hideInSearch: true,
      render: (_, record) => (
        <MySwitch
          value={record.canTransferTo}
          request={() => toggleCanTransferTo(record.id)}
          onSuccess={successHandler}
        />
      ),
    },
    {
      title: t('label.enable'),
      dataIndex: 'enable',
      sorter: true,
      hideInSearch: true,
      render: (_, record) => (
        <MySwitch
          value={record.enable}
          request={() => toggle('accounts', record.id)}
          onSuccess={successHandler}
        />
      ),
    },
    {
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      render: (_, record) => [
        <Button type="link" onClick={() => deleteHandler(record)}>
          {t('delete.permanent')}
        </Button>,
        <Button type="link" onClick={() => recoverHandler(record)}>
          {t('recover')}
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        {...tableProp}
        actionRef={actionRef}
        columns={columns}
        params={{ deleted: true }}
        request={(params = {}, sort, _) => {
          return query('accounts', { ...params, ...{ sort: tableSortFormat(sort) } });
        }}
      />
    </>
  );
};
