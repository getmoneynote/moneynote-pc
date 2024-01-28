import {useRef} from "react";
import {Button} from "antd";
import {ModalForm, ProFormSwitch, ProFormText, ProFormTextArea} from "@ant-design/pro-components";
import {PlusOutlined} from "@ant-design/icons";
import {requiredRules} from "@/utils/rules";
import {create} from "@/services/common";
import t from "@/utils/i18n";

export default (props) => {

  const formRef = useRef();
  const { book, type } = props;

  return (
    <ModalForm
      title={t('add') + t('tab.payee')}
      width={500}
      layout="horizontal"
      labelCol={{ style: { width: 'auto', minWidth: 70 } }}
      grid={true}
      modalProps={{ destroyOnClose: false, maskClosable: false }}
      formRef={formRef}
      trigger={
        <Button icon={<PlusOutlined />} type="link">{t('add')}</Button>
      }
      onOpenChange={open => {
        setTimeout(() => {
          formRef.current?.resetFields();
          formRef.current?.setFieldsValue({
            canExpense: type === 'EXPENSE',
            canIncome: type === 'INCOME',
          });
        }, 50)
      }}
      onFinish={async (values) => {
        await create('payees', {...values, ...{ bookId: book.id } });
        formRef.current?.resetFields();
        return true;
      }}
    >
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 6 }} />
      <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 6 }} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
    </ModalForm>
  );

}
