import {useEffect, useState} from "react";
import { useModel } from '@umijs/max';
import { ProFormText, ProFormTextArea, ProFormDateTimePicker } from '@ant-design/pro-components';
import moment from "moment/moment";
import { adjust } from '@/services/account';
import {amountRequiredRules, requiredRules} from "@/utils/rules";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ actionRef }) => {

  const { currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    setInitialValues({
      'createTime': moment(),
    });
  }, []);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    await adjust(currentRow.id, values);
  }

  return (
    <>
      <MyModalForm
        title={currentRow.name + t('adjust.balance')}
        labelWidth={80}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormDateTimePicker name="createTime" format="YYYY-MM-DD HH:mm" label={t('flow.label.createTime')} allowClear={false} rules={requiredRules()} />
        <ProFormText name="balance" label={t('account.label.balance')} rules={amountRequiredRules()} />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
}
