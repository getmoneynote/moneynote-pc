import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { query1, toggle } from '@/services/common';
import TrashButton from "@/components/TrashButton";
import { tableProp } from '@/utils/prop';
import CategoryForm from './CategoryForm';
import {tableSortFormat} from "@/utils/util";
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { show } = useModel('modal');

  const addHandler = (record) => {
    show(<CategoryForm type={type} actionRef={actionRef} />, 1, record)
  };

  const updateHandler = (record) => {
    show(<CategoryForm type={type} actionRef={actionRef} />, 2, record)
  };

  function successHandler() {
    actionRef.current?.reload();
  }

  const trashHandler = async (record) => {
    await toggle('categories', record.id);
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
        <Button
          type="link"
          onClick={ () => updateHandler(record) }
        >
          {t('update')}
        </Button>,
        <Button
          type="link"
          onClick={ () => addHandler(record) }
        >
          {t('add')}
        </Button>,
        <TrashButton onClick={() => trashHandler(record)} />,
      ],
    },
  ];

  return (
    <ProTable
      {...tableProp}
      actionRef={actionRef}
      pagination={false}
      toolBarRender={() => [
        <Button type="primary" onClick={ () => addHandler() }>
          <PlusOutlined />
          {t('add')}
        </Button>,
      ]}
      columns={columns}
      request={(params = {}, sort, _) => {
        return query1('categories', { ...params, ...{ type: type }, ...{ sort: tableSortFormat(sort) } });
      }}
    />
  );
};
