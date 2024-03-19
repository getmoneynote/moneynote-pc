import {useState} from "react";
import { Button, Modal, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import {useIntl, useModel} from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { query1, toggle } from '@/services/common';
import { exportFlow } from '@/services/book';
import { setDefaultBook } from '@/services/user';
import { tableProp } from '@/utils/prop';
import ActionForm from './ActionForm';
import CopyForm from "./CopyForm";
import {tableSortFormat, timeZoneOffset} from "@/utils/util";
import TrashButton from "@/components/TrashButton";
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('Book.model');
  const { show } = useModel('modal');

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

  const copyHandler = (record) => {
    show(<CopyForm />, 1, record);
  }

  const setDefaultHandler = async (record) => {
    await setDefaultBook(record.id);
    window.location.reload();
  };

  const trashHandler = async (record) => {
    const res = await toggle('books', record.id);
    if (res.success) {
      successHandler();
    }
  };

  const [exportingBook, setExportingBook] = useState();
  const exportFlowHandler = async (record) => {
    const messageFailExport = intl.formatMessage({ id: 'book.export.fail' });
    const messageConfirmExport = intl.formatMessage({ id: 'confirm.msg' });
    Modal.confirm({
      title: messageConfirmExport,
      onOk: async () => {
        setExportingBook(record);
        try {
          const response = await exportFlow(record.id, timeZoneOffset());
          if (response.type === 'application/json') {
            let reader = new FileReader()
            reader.onload = e => {
              if (e.target.readyState === 2) {
                let res = {}
                res = JSON.parse(e.target.result)
                message.error(res.message);
              }
            }
            reader.readAsText(response);
            setExportingBook(null);
            return false;
          }
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
      sorter: true,
      hideInSearch: true,
    },
    {
      title: t('sort'),
      dataIndex: 'sort',
      sorter: true,
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
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      render: (_, record) => [
        <Button
          size="small"
          type="link"
          disabled={record.current || !record.enable}
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
          loading={record.id === exportingBook?.id}
          onClick={() => exportFlowHandler(record)}
        >
          {t('book.export')}
        </Button>,
        <TrashButton onClick={() => trashHandler(record)} disabled={record.current || record.groupDefault} />,
        <Button
          size="small"
          type="link"
          onClick={ () => copyHandler(record) }
        >
          {t('copy')}
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
        request={ (params = {}, sort, _) => query1('books', { ...params, ...{ sort: tableSortFormat(sort) } }) }
      />
    </>
  );
};
