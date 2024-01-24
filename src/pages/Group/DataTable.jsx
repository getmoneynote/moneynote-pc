import { Button, Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { query, remove } from '@/services/common';
import { agree, reject } from '@/services/group';
import { setDefaultGroup } from '@/services/user';
import { tableProp } from '@/utils/prop';
import ActionForm from './ActionForm';
import InviteForm from './InviteForm';
import UserListForm from './UserListForm';
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

  const inviteHandler = (record) => {
    show(<InviteForm />, 1, record);
  };

  const userListHandler = async (record) => {
    show(<UserListForm />, 1, record);
  };

  const agreeHandler = async (record) => {
    await agree(record.id);
    successHandler();
  };

  const rejectHandler = async (record) => {
    await reject(record.id);
    successHandler();
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
    window.location.reload();
    // const response = await initialState.fetchUserInfo();
    // setInitialState(prevState => ({
    //   ...prevState,
    //   currentUser: response.user,
    //   currentBook: response.book,
    //   currentGroup: response.group,
    // }));
    // successHandler();
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
      title: t('group.label.default.book'),
      dataIndex: 'defaultBook',
      render: (_, record) => record.defaultBook?.name,
    },
    {
      title: t('label.notes'),
      dataIndex: 'notes',
    },
    {
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        if (record.roleId === 4) {
          return [
            <Button
              size="small"
              type="link"
              onClick={() => agreeHandler(record)}
            >
              {t('group.agree')}
            </Button>,
            <Button
              size="small"
              type="link"
              onClick={() => rejectHandler(record)}
            >
              {t('group.reject')}
            </Button>,
          ]
        } else {
          return [
            <Button
              size="small"
              type="link"
              disabled={record.current}
              onClick={() => setDefaultHandler(record)}
            >
              {t('book.set.default')}
            </Button>,
            <Button
              size="small"
              type="link"
              disabled={record.roleId !== 1}
              onClick={() => updateHandler(record)}
            >
              {t('update')}
            </Button>,
            <Button
              size="small"
              type="link"
              disabled={record.current}
              onClick={() => deleteHandler(record)}
            >
              {t('delete')}
            </Button>,
            <Button
              size="small"
              type="link"
              disabled={record.roleId !== 1}
              onClick={() => inviteHandler(record)}
            >
              {t('group.invite')}
            </Button>,
            <Button
              size="small"
              type="link"
              disabled={record.roleId !== 1}
              onClick={() => userListHandler(record)}
            >
              {t('group.user.list')}
            </Button>,
          ]
        }
      },
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
