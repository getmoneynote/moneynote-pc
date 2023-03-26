import { Button, message, Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { query, remove, toggle } from '@/services/common';
import { setDefaultBook } from '@/services/user';
import { useMsg } from '@/utils/hooks';
import MySwitch from '@/components/MySwitch';
import { tableProp } from '@/utils/prop';
import ActionForm from './ActionForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('Book.model');
  const { show } = useModel('modal');
  const { successMsg } = useMsg();
  const { initialState, setInitialState } = useModel('@@initialState');

  function successHandler() {
    message.success(successMsg);
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
        await remove('books', record.id);
        successHandler();
      },
    });
  };

  const setDefaultHandler = async (record) => {
    await setDefaultBook(record.id);
    // window.location.reload();
    const response = await initialState.fetchUserInfo();
    setInitialState(prevState => ({
      ...prevState,
      currentBook: response.book,
    }))
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
      title: t('book.label.default.expense.account'),
      dataIndex: 'defaultExpenseAccount',
      render: (value) => value?.name ?? '-',
    },
    {
      title: t('book.label.default.income.account'),
      dataIndex: 'defaultIncomeAccount',
      render: (value) => value?.name ?? '-',
    },
    {
      title: t('book.label.default.expense.category'),
      dataIndex: 'defaultExpenseCategory',
      render: (value) => value?.name ?? '-',
    },
    {
      title: t('book.label.default.income.category'),
      dataIndex: 'defaultIncomeCategory',
      render: (value) => value?.name ?? '-',
    },
    {
      title: t('book.label.default.transfer.from.account'),
      dataIndex: 'defaultTransferFromAccount',
      render: (value) => value?.name ?? '-',
    },
    {
      title: t('book.label.default.transfer.to.account'),
      dataIndex: 'defaultTransferToAccount',
      render: (value) => value?.name ?? '-',
    },
    {
      title: t('label.enable'),
      dataIndex: 'enable',
      render: (_, record) => (
        <MySwitch
          disabled={initialState.currentBook.id === record.id}
          value={record.enable}
          request={() => toggle('books', record.id)}
          onSuccess={successHandler}
        />
      ),
    },
    {
      title: t('operation'),
      align: 'center',
      render: (_, record) => [
        <Button
          size="small"
          type="link"
          disabled={initialState.currentBook.id === record.id || !record.enable}
          onClick={() => setDefaultHandler(record)}
        >
          {t('book.set.default')}
        </Button>,
        <Button
          size="small"
          type="link"
          disabled={initialState.currentBook.id !== record.id}
          onClick={() => updateHandler(record)}
        >
          {t('update')}
        </Button>,
        <Button
          size="small"
          type="link"
          disabled={initialState.currentBook.id === record.id}
          onClick={() => deleteHandler(record)}
        >
          {t('delete')}
        </Button>,
      ],
    },
  ];

  function expandedRowRender(record) {
    if (record.notes) {
      return (
        <span>
          {t('label.notes')}: {record.notes}
        </span>
      );
    } else {
      return null;
    }
  }

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
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          rowExpandable: (record) => expandedRowRender(record),
        }}
        request={() => query('books')}
      />
    </>
  );
};
