import { useEffect, useState } from 'react';
import {useModel} from '@umijs/max';
import {
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {create, query, update} from '@/services/tag';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { tagActionRef } = useModel('Category.model');
  const { action, currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        pId: currentRow?.id,
        canExpense: true,
        canIncome: false,
        canTransfer: false,
      });
    } else if (action === 2) {
      setInitialValues({ ...currentRow });
    }
  }, [action, currentRow]);

  const successHandler = () => {
    tagActionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    if (action === 1) {
      await create(values);
    } else if (action === 2) {
      await update(currentRow.id, values);
    }
  };

  return (
    <MyModalForm
      title={(action === 1 ? t('add') : t('update')) + t('tab.tag')}
      labelWidth={80}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={initialValues}
    >
      <ProFormTreeSelect
        name="pId"
        label={t('label.parent.tag')}
        request={async () => {
          const response = await query({ enable: true });
          return response.data;
        }}
        fieldProps={{
          ...treeSelectSingleProp,
        }}
      />
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 8 }} />
      <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 8 }} />
      <ProFormSwitch name="canTransfer" label={t('label.canTransfer')} colProps={{ xl: 8 }} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
    </MyModalForm>
  );
};
