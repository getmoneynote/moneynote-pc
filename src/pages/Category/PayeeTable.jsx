import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { query, remove, toggle } from '@/services/common';
import { toggleCanExpense, toggleCanIncome } from '@/services/payee';
import { useMsg } from '@/utils/hooks';
import { tableProp } from '@/utils/prop';
import MySwitch from '@/components/MySwitch';
import PayeeForm from './PayeeForm';
import t from '@/utils/i18n';

export default () => {

  const { payeeActionRef } = useModel('Category.model');
  const { show } = useModel('modal');
  const { successMsg } = useMsg();

  const addHandler = (record) => {
    show(<PayeeForm />, 1, record);
  };

  const updateHandler = (record) => {
    show(<PayeeForm />, 2, record);
  };

  function successHandler() {
    message.success(successMsg);
    payeeActionRef.current?.reload();
  }

  const intl = useIntl();
  const deleteHandler = (record) => {
    const messageDeleteConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
      { name: record.name },
    );
    Modal.confirm({
      title: messageDeleteConfirm,
      onOk: async () => {
        await remove('payees', record.id);
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
          request={() => toggle('payees', record.id)}
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
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      render: (_, record) => [
        <Button type="link" onClick={() => updateHandler(record)}>
          {t('update')}
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
      toolBarRender={() => [
        <Button type="primary" onClick={() => addHandler()}>
          <PlusOutlined />
          {t('add')}
        </Button>,
      ]}
      columns={columns}
      request={ () => query('payees') }
      actionRef={payeeActionRef}
    />
  );
};
