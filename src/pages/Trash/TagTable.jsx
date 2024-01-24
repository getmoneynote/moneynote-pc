import {useRef} from "react";
import {Button, Modal} from 'antd';
import { ProTable } from '@ant-design/pro-components';
import {useIntl} from '@umijs/max';
import {query2, remove, toggle} from '@/services/common';
import { tableProp } from '@/utils/prop';
import {tableSortFormat} from "@/utils/util";
import t from '@/utils/i18n';

export default ({ type }) => {

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
        await remove('tags', record.id);
        successHandler();
      },
    });
  };

  const recoverHandler = async (record) => {
    await toggle('tags', record.id);
    successHandler();
  };

  const columns = [
    {
      title: t('label.name'),
      dataIndex: 'name',
    },
    {
      title: t('label.notes'),
      dataIndex: 'notes',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: t('sort'),
      dataIndex: 'sort',
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
      pagination={false}
      columns={columns}
      request={(params = {}, sort, _) => {
        return query2('tags', { ...params, ...{ sort: tableSortFormat(sort) } });
      }}
    />
  );
};
