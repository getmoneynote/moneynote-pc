import {useEffect, useState} from "react";
import {useModel} from "@umijs/max";
import { ProFormTextArea } from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import { updateNotes } from '@/services/account';
import t from '@/utils/i18n';

export default ({ actionRef }) => {

  const { currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    setInitialValues({
      notes: currentRow.notes
    });
  }, [currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    await updateNotes(currentRow.id, values.notes)
  }

  return (
    <>
      <MyModalForm
        title={ t('action.title', {'action': t('update'), 'title': t('label.notes')} ) }
        width={700}
        labelWidth={85}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormTextArea
          name="notes"
          label={t('label.notes')}
          fieldProps={{
            autoSize: { minRows: 20 }
          }}
        />
      </MyModalForm>
    </>
  );
}
