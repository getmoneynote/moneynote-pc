import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { query1, toggle } from '@/services/common';
import TrashButton from "@/components/TrashButton";
import { toggleCanExpense, toggleCanIncome, toggleCanTransfer } from '@/services/tag';
import { tableProp } from '@/utils/prop';
import MySwitch from '@/components/MySwitch';
import TagForm from './TagForm';
import {tableSortFormat} from "@/utils/util";
import t from '@/utils/i18n';

export default () => {

  const { tagActionRef } = useModel('Category.model');
  const { show } = useModel('modal');

  const addHandler = (record) => {
    show(<TagForm />, 1, record);
  };

  const updateHandler = (record) => {
    show(<TagForm />, 2, record);
  };

  function successHandler() {
    tagActionRef.current?.reload();
  }

  const trashHandler = async (record) => {
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
        <Button type="link" onClick={() => updateHandler(record)}>
          {t('update')}
        </Button>,
        <Button type="link" onClick={() => addHandler(record)}>
          {t('add')}
        </Button>,
        <TrashButton onClick={() => trashHandler(record)} />,
      ],
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
      title: t('label.canTransfer'),
      dataIndex: 'canTransfer',
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
          value={record.canTransfer}
          request={() => toggleCanTransfer(record.id)}
          onSuccess={successHandler}
        />
      ),
    },
  ];

  return (
    <ProTable
      {...tableProp}
      pagination={false}
      toolBarRender={() => [
        <Button type="primary" onClick={() => addHandler()}>
          <PlusOutlined />
          {t('add')}
        </Button>,
      ]}
      columns={columns}
      request={ (params = {}, sort, _) => query1('tags', { ...params, ...{ sort: tableSortFormat(sort) } }) }
      actionRef={tagActionRef}
    />
  );
};
