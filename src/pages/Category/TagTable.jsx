import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { query, remove, toggle } from '@/services/common';
import { toggleCanExpense, toggleCanIncome, toggleCanTransfer } from '@/services/tag';
import { useMsg } from '@/utils/hooks';
import { tableProp } from '@/utils/prop';
import MySwitch from '@/components/MySwitch';
import TagForm from './TagForm';
import t from '@/utils/i18n';

export default () => {

  const { tagActionRef } = useModel('Category.model');
  const { show } = useModel('modal');
  const { successMsg } = useMsg();

  const addHandler = (record) => {
    show(<TagForm />, 1, record);
  };

  const updateHandler = (record) => {
    show(<TagForm />, 2, record);
  };

  function successHandler() {
    message.success(successMsg);
    tagActionRef.current?.reload();
  }

  const intl = useIntl();
  const deleteHandler = (record) => {
    const messageConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
      { name: record.name },
    );
    Modal.confirm({
      title: messageConfirm,
      onOk: async () => {
        await remove('tags', record.id);
        successHandler();
      },
    });
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
      title: t('label.enable'),
      dataIndex: 'enable',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: t('yes'), value: true },
          { label: t('no'), value: false },
        ],
      },
      render: (_, record) => (
        <MySwitch
          value={record.enable}
          request={() => toggle('tags', record.id)}
          onSuccess={successHandler}
        />
      ),
    },
    {
      title: t('label.canExpense'),
      dataIndex: 'canExpense',
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
        <Button type="link" onClick={() => deleteHandler(record)}>
          {t('delete')}
        </Button>,
      ],
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
      request={ () => query('tags') }
      actionRef={tagActionRef}
    />
  );
};
