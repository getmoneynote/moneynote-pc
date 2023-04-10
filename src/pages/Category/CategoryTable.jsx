import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { query, remove, toggle } from '@/services/common';
import { tableProp } from '@/utils/prop';
import MySwitch from '@/components/MySwitch';
import CategoryForm from './CategoryForm';
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { show } = useModel('modal');
  const intl = useIntl();

  const addHandler = (record) => {
    show(<CategoryForm type={type} actionRef={actionRef} />, 1, record)
  };

  const updateHandler = (record) => {
    show(<CategoryForm type={type} actionRef={actionRef} />, 2, record)
  };

  function successHandler() {
    actionRef.current?.reload();
  }

  const deleteHandler = (record) => {
    const messageConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
      { name: record.name },
    );
    Modal.confirm({
      title: messageConfirm,
      onOk: async () => {
        await remove('categories', record.id);
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
          request={() => toggle('categories', record.id)}
          onSuccess={successHandler}
        />
      ),
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
        <Button
          type="link"
          onClick={() => deleteHandler(record)}
        >
          {t('delete')}
        </Button>,
      ],
    },
  ];

  return (
    <ProTable
      {...tableProp}
      actionRef={actionRef}
      pagination={false}
      toolBarRender={() => [
        <Button type="primary" onClick={ addHandler }>
          <PlusOutlined />
          {t('add')}
        </Button>,
      ]}
      columns={columns}
      request={(params = {}, __, _) => {
        return query('categories', { ...params, ...{ type: type }});
      }}
    />
  );
};
