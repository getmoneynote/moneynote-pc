import { Button, Modal } from 'antd';
import { useIntl, useModel } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import moment from 'moment';
import { query, remove } from '@/services/common'
import { recall, runOnce } from '@/services/note-day';
import { tableProp } from '@/utils/prop';
import ActionForm from './ActionForm';
import t from '@/utils/i18n';
import {dateFormatStr2} from "@/utils/util";

export default () => {

  const { actionRef } = useModel('NoteDay.model');
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
  const deleteHandler = (record) => {
    const messageDeleteConfirm = intl.formatMessage(
      { id: 'delete.confirm' },
      { name: record.title },
    );
    Modal.confirm({
      title: messageDeleteConfirm,
      onOk: async () => {
        await remove('note-days', record.id);
        successHandler();
      },
    });
  };

  const runHandler = async (record) => {
    await runOnce(record.id);
    successHandler();
  };

  const recallHandler = async (record) => {
    await recall(record.id);
    successHandler();
  };

  const columns = [
    {
      title: t('note.day.label.title'),
      dataIndex: 'title',
    },
    {
      title: t('note.day.label.start.date'),
      dataIndex: 'startDate',
      sorter: true,
      align: 'center',
      render: (value) => moment(value).format(dateFormatStr2()),
    },
    {
      title: t('note.day.label.end.date'),
      dataIndex: 'endDate',
      align: 'center',
      render: (value) => moment(value).format(dateFormatStr2()),
    },
    {
      title: t('note.day.label.repeatDescription'),
      dataIndex: 'repeatDescription',
    },
    {
      title: t('note.day.label.nextDate'),
      dataIndex: 'nextDate',
      sorter: true,
      render: (value) => moment(value).format(dateFormatStr2()),
    },
    {
      title: t('note.day.label.countDown'),
      dataIndex: 'countDown',
    },
    {
      title: t('note.day.label.totalCount'),
      dataIndex: 'totalCount',
      sorter: true,
    },
    {
      title: t('note.day.label.runCount'),
      dataIndex: 'runCount',
      sorter: true,
    },
    {
      title: t('note.day.label.remainCount'),
      dataIndex: 'remainCount',
    },
    {
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      width: 250,
      render: (_, record) => [
        <Button size="small" type="link" onClick={() => runHandler(record)}>
          {t('note.day.run')}
        </Button>,
        <Button size="small" type="link" onClick={() => recallHandler(record)}>
          {t('note.day.recall')}
        </Button>,
        <Button size="small" type="link" onClick={() => updateHandler(record)}>
          {t('update')}
        </Button>,
        <Button size="small" type="link" onClick={() => deleteHandler(record)}>
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
        request={ () => query('note-days') }
      />
    </>
  );
};
