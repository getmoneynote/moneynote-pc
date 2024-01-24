import {useRef} from 'react';
import {Button, Modal} from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import {remove, toggle, query2} from '@/services/common';
import {tableProp} from '@/utils/prop';
import { tableSortFormat } from '@/utils/util';
import t from '@/utils/i18n';


export default () => {

  const actionRef = useRef();

  function successHandler() {
    actionRef.current?.reload();
  }

  const intl = useIntl();
  const deleteHandler = (record) => {
    const messageDeleteConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
    );
    Modal.confirm({
      title: messageDeleteConfirm,
      onOk: async () => {
        await remove('accounts', record.id);
        successHandler();
      },
    });
  };

  const recoverHandler = async (record) => {
    await toggle('accounts', record.id);
    successHandler();
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
    <ProTable
      {...tableProp}
      actionRef={actionRef}
      columns={columns}
      request={(params = {}, sort, _) => {
        return query2('accounts', { ...params, ...{ sort: tableSortFormat(sort) } });
      }}
    />
  );
};
