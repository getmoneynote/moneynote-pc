import {useEffect, useState} from 'react';
import {message, Modal, Upload} from "antd";
import {useModel} from "@umijs/max";
import {PlusOutlined} from '@ant-design/icons';
import MyModalForm from '@/components/MyModalForm';
import { remove } from '@/services/common';
import { getFiles, buildUrl } from '@/services/flow';
import t from "@/utils/i18n";


export default ({ flowId }) => {

  const [fileList, setFileList] = useState([]);
  const { visible } = useModel('modal');

  const maxFileCount = 6;

  const fileSizeError = t('flow.file.size.error');
  const messageDeleteConfirm = t('delete.confirm', { name: '' });

  const uploadProps = {
    accept: 'image/jpeg, image/png, application/pdf',
    multiple: true,
    maxCount: maxFileCount,
    fileList: fileList,
    listType: 'picture-card',
    action: `/api/v1/balance-flows/${flowId}/addFile`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ''}`,
    },
    isImageUrl(file) {
      return file.isImage;
    },
    showUploadList: {
      showDownloadIcon: false, showRemoveIcon: true, showPreviewIcon: true
    },
    onChange(info) {
      let newFileList = [...info.fileList];
      newFileList = newFileList.map(file => {
        if (file.status === 'done' && file.response && file.response.success) {
          file.url = buildUrl(file.response.data);
          file.thumbUrl = buildUrl(file.response.data);
          file.id = file.response.data.id;
          file.isImage = file.response.data.image;
        }
        return file;
      });
      setFileList(newFileList);
    },
    beforeUpload(file) {
      if (file.size > 20*1024*1024) { //20M
        message.error(fileSizeError);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onRemove(file) {
      Modal.confirm({
        title: messageDeleteConfirm,
        onOk: async () => {
          remove('flow-files', file.id).then(res => {
            if (res.success) {
              fetchFiles(flowId);
            }
          });
        },
      });
      return false;
    }
  }

  useEffect(() => {
    if (visible) {
      setFileList([]);
      fetchFiles(flowId);
    }
  }, [flowId, visible]);

  function fetchFiles(flowId) {
    getFiles(flowId).then(res => {
      if (res.success) {
        setFileList(
          res.data.map(file => ({
            uid: file.id,
            id: file.id,
            status: 'done',
            isImage: file.image,
            url: buildUrl(file),
          }))
        )
      }
    })
  }

  return (
    <MyModalForm
      title={t('flow.modal.file.title')}
      submitter={false}
    >
      <Upload {...uploadProps}>
        {
          fileList.length >= maxFileCount ?
            null :
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        }
      </Upload>
    </MyModalForm>
  )

}
