import {Button} from "antd";
import { ProTable } from '@ant-design/pro-components';
import { useModel } from "@umijs/max";
import { queryBookTemplates } from '@/services/api';
import { tableProp } from '@/utils/prop';
import CopyForm from './CopyForm';
import t from '@/utils/i18n';

export default () => {

  const { show } = useModel('modal');

  const copyHandler = (record) => {
    show(<CopyForm />, 1, record);
  }

  const columns = [
    {
      title: t('label.name'),
      dataIndex: 'name',
    },
    {
      title: t('template.label.previewUrl'),
      dataIndex: 'previewUrl',
      render: (_, record) => <a href={record.previewUrl} target="_blank">{t('template.label.preview.click')}</a>,
      hideInSearch: true,
    },
    {
      title: t('label.notes'),
      dataIndex: 'notes',
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
          onClick={ () => copyHandler(record) }
        >
          {t('copy')}
        </Button>,
      ],
    },
  ];

  return (
    <ProTable
      {...tableProp}
      search={false}
      columns={columns}
      request={ queryBookTemplates }
    />
  );
};
