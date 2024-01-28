import {useRef} from "react";
import {Button} from "antd";
import {ModalForm, ProFormSwitch, ProFormText, ProFormTextArea, ProFormTreeSelect} from "@ant-design/pro-components";
import {PlusOutlined} from "@ant-design/icons";
import {useRequest} from "@umijs/max";
import {requiredRules} from "@/utils/rules";
import {treeSelectSingleProp} from "@/utils/prop";
import {create, queryAll} from "@/services/common";
import t from "@/utils/i18n";

export default (props) => {

  const formRef = useRef();
  const { book, type } = props;

  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => queryAll('tags', {
    'bookId': book.id,
  }), { manual: true });

  return (
    <ModalForm
      title={t('add') + t('tab.tag')}
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
            canTransfer: type === 'TRANSFER',
          });
        }, 50)
      }}
      onFinish={async (values) => {
        let form = JSON.parse(JSON.stringify(values));
        form.pId = values.pId?.value;
        await create('tags', {...form, ...{ bookId: book.id } });
        formRef.current?.resetFields();
        return true;
      }}
    >
      <ProFormTreeSelect
        name="pId"
        label={t('label.parent.tag')}
        fieldProps={{
          ...treeSelectSingleProp,
          loading: tagsLoading,
          options: tags,
          onFocus: loadTags,
        }}
      />
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 8 }} />
      <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 8 }} />
      <ProFormSwitch name="canTransfer" label={t('label.canTransfer')} colProps={{ xl: 8 }} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
    </ModalForm>
  );

}
