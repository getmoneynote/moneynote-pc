import { useEffect, useState } from 'react';
import {useModel, useRequest} from '@umijs/max';
import {
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import {create, queryAll, update} from '@/services/common';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import {translateAction} from "@/utils/util";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { tagActionRef, bookId } = useModel('Category.model');
  const { action, currentRow, visible } = useModel('modal');

  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => queryAll('tags', {
    'bookId': bookId,
  }), { manual: true });
  useEffect(() => {
    if (visible) {
      loadTags();
    }
  }, [visible]);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        parent: currentRow,
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
    let form = JSON.parse(JSON.stringify(values));
    form.pId = values.parent?.value;
    delete form.parent;
    if (action === 1) {
      await create('tags', {...form, ...{ bookId: bookId } });
    } else if (action === 2) {
      await update('tags', currentRow.id, form);
    }
  };

  return (
    <MyModalForm
      title={translateAction(action) + t('tab.tag')}
      labelWidth={80}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={initialValues}
    >
      <ProFormTreeSelect
        name="parent"
        label={t('label.parent.tag')}
        fieldProps={{
          ...treeSelectSingleProp,
          loading: tagsLoading,
          options: tags,
        }}
      />
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 8 }} />
      <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 8 }} />
      <ProFormSwitch name="canTransfer" label={t('label.canTransfer')} colProps={{ xl: 8 }} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
      <ProFormDigit name="sort" label={t('sort')} />
    </MyModalForm>
  );
};
