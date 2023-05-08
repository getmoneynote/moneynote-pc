import { Button, Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { query, remove } from '@/services/common';
import { setDefaultGroup } from '@/services/user';
import { tableProp } from '@/utils/prop';
import ActionForm from './ActionForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('Group.model');
  const { show } = useModel('modal');
  const { initialState, setInitialState } = useModel('@@initialState');

  function successHandler() {
    actionRef.current?.reload();
  }

  const addHandler = () => {
    show(<ActionForm />);
  };

  const updateHandler = (record) => {
    show(<ActionForm />, 2, record);
  };

  const intl = useIntl();
  const deleteHandler = (record) => {
    const messageConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
      { name: record.name },
    );
    Modal.confirm({
      title: messageConfirm,
      onOk: async () => {
        await remove('groups', record.id);
        successHandler();
      },
    });
  };

  const setDefaultHandler = async (record) => {
    await setDefaultGroup(record.id);
    // window.location.reload();
    const response = await initialState.fetchUserInfo();
    setInitialState(prevState => ({
      ...prevState,
      currentBook: response.book,
    }));
    successHandler();
  };

  const columns = [
    {
      title: t('label.name'),
      dataIndex: 'name',
    },
    {
      title: t('account.label.currencyCode'),
      dataIndex: 'defaultCurrencyCode',
    },
    {
      title: t('group.label.role'),
      dataIndex: 'role',
    },
    {
      title: t('label.notes'),
      dataIndex: 'notes',
    },
    {
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      render: (_, record) => [
        <Button
          size="small"
          type="link"
          disabled={record.default || !record.enable}
          onClick={() => setDefaultHandler(record)}
        >
          {t('book.set.default')}
        </Button>,
        <Button
          size="small"
          type="link"
          onClick={() => updateHandler(record)}
        >
          {t('update')}
        </Button>,
        <Button
          size="small"
          type="link"
          disabled={initialState.currentGroup?.id === record.id}
          onClick={() => deleteHandler(record)}
        >
          {t('delete')}
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable
        {...tableProp}
        search={false}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" onClick={() => addHandler()}>
            <PlusOutlined />
            {t('add')}
          </Button>,
        ]}
        columns={columns}
        request={ (params = {}, __, _) => query('groups', { ...params}) }
      />
    </>
  );
};
