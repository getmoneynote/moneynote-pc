import {useEffect, useRef} from "react";
import {Button, Modal} from "antd";
import {ProTable} from "@ant-design/pro-components";
import {useModel} from "@umijs/max";
import {tableProp} from "@/utils/prop";
import {getUsers, removeUser} from '@/services/group';
import t from '@/utils/i18n';


export default () => {

  const { currentRow } = useModel('modal');
  const { visible, setVisible } = useModel('modal');
  const actionRef = useRef();

  const deleteHandler = async (record) => {
    await removeUser(currentRow.id, record.id);
    actionRef.current?.reload();
  };

  useEffect(() => {
    if (visible) {
      actionRef.current?.reload();
    }
  }, [visible]);

  const columns = [
    {
      title: t('group.user.list.username'),
      dataIndex: 'username',
    },
    {
      title: t('group.user.list.nickName'),
      dataIndex: 'nickName',
    },
    {
      title: t('group.user.list.role'),
      dataIndex: 'role',
    },
    {
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      render: (_, record) => [
        <Button
          size="small"
          type="link"
          onClick={() => deleteHandler(record)}
        >
          {t('delete')}
        </Button>
      ],
    },
  ]

  return (
    <>
      <Modal
        title={ t('group.user.list') }
        open={visible}
        onCancel={ () => setVisible(false) }
        footer={null}
      >
        <ProTable
          {...tableProp}
          search={false}
          pagination={false}
          actionRef={actionRef}
          columns={columns}
          toolBarRender={false}
          request={ () => getUsers(currentRow.id) }
        />
      </Modal>
    </>
  );
};
