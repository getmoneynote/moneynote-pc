import {useEffect, useState} from "react";
import { useModel } from '@umijs/max';
import { ProFormText, ProFormTextArea, ProFormDateTimePicker } from '@ant-design/pro-components';
import moment from "moment/moment";
import { createAdjust, updateAdjust } from '@/services/account';
import {amountRequiredRules, requiredRules} from "@/utils/rules";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ actionRef }) => {

  const { action, currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        'createTime': moment(),
        'balance': currentRow.balance.toString(),
      });
    } else if (action === 2) {
      setInitialValues({
        ...currentRow,
      });
    }
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    if (action === 1) {
      await createAdjust(currentRow.id, values);
    } else if (action === 2) {
      await updateAdjust(currentRow.id, values);
    }
  }

  return (
    <>
      <MyModalForm
        title={`${action ===2 ? t('update') : ''}${action === 1 ? currentRow.name : currentRow.account.name}${t('adjust.balance')}`}
        labelWidth={80}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormDateTimePicker name="createTime" format="YYYY-MM-DD HH:mm" label={t('flow.label.createTime')} allowClear={false} rules={requiredRules()} />
        {
          action === 1 &&
          <ProFormText name="balance" label={t('account.label.balance')} rules={amountRequiredRules()} />
        }
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
}
