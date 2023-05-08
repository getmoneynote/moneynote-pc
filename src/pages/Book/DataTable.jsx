import {useState} from "react";
import { Button, Modal, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { useIntl, useModel, history } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { query, remove, toggle } from '@/services/common';
import { setDefaultBook } from '@/services/user';
import { exportFlow } from '@/services/book';
import MySwitch from '@/components/MySwitch';
import { tableProp } from '@/utils/prop';
import ActionForm from './ActionForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('Book.model');
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
    }));
    successHandler();
  };

  const [exportingBook, setExportingBook] = useState();
  const exportFlowHandler = async (record) => {
    const messageFailExport = intl.formatMessage({ id: 'book.export.fail' });
    const messageConfirmExport = intl.formatMessage({ id: 'book.export.confirm' });
    Modal.confirm({
      title: messageConfirmExport,
      onOk: async () => {
        setExportingBook(record);
        try {
          const response = await exportFlow(record.id);
          console.log(response);
          // 构造文件下载链接
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'data.xlsx');

          // 模拟点击链接以下载文件
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          const responseObj = await error.response.data.text();
          const responseJson = JSON.parse(responseObj)
          if (responseJson?.message) {
            message.error(responseJson?.message);
          } else {
            message.error(messageFailExport)
          }
        }
        setExportingBook(null);
      }
    });
  }

  const columns = [
    {
      title: t('label.name'),
      dataIndex: 'name',
    },
    {
      title: t('account.label.currencyCode'),
      dataIndex: 'defaultCurrencyCode',
      hideInSearch: true,
    },
    {
      title: t('book.label.default.expense.account'),
      dataIndex: 'defaultExpenseAccount',
      render: (value) => value?.name ?? '-',
      hideInSearch: true,
    },
    {
      title: t('book.label.default.income.account'),
      dataIndex: 'defaultIncomeAccount',
      render: (value) => value?.name ?? '-',
      hideInSearch: true,
    },
    {
      title: t('book.label.default.expense.category'),
      dataIndex: 'defaultExpenseCategory',
      render: (value) => value?.name ?? '-',
      hideInSearch: true,
    },
    {
      title: t('book.label.default.income.category'),
      dataIndex: 'defaultIncomeCategory',
      render: (value) => value?.name ?? '-',
      hideInSearch: true,
    },
    {
      title: t('book.label.default.transfer.from.account'),
      dataIndex: 'defaultTransferFromAccount',
      render: (value) => value?.name ?? '-',
      hideInSearch: true,
    },
    {
      title: t('book.label.default.transfer.to.account'),
      dataIndex: 'defaultTransferToAccount',
      render: (value) => value?.name ?? '-',
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
          disabled={initialState.currentBook?.id === record.id}
          value={record.enable}
          request={() => toggle('books', record.id)}
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
          onClick={() => history.push(`/categories?bookId=${record.id}&bookName=${record.name}`, { book: record })}
        >
          {t('book.config')}
        </Button>,
        <Button
          size="small"
          type="link"
          loading={record.id === exportingBook?.id}
          onClick={() => exportFlowHandler(record)}
        >
          {t('book.export')}
        </Button>,
        <Button
          size="small"
          type="link"
          disabled={initialState.currentBook?.id === record.id}
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
        request={ (params = {}, __, _) => query('books', { ...params}) }
      />
    </>
  );
};
