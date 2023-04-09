import { useEffect, useState } from 'react';
import { ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import {useModel, useRequest} from '@umijs/max';
import MyModalForm from '@/components/MyModalForm';
import {create, update, query} from '@/services/common';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import {translateAction} from "@/utils/util";
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { action, currentRow } = useModel('modal');

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => query('categories', {
    // 'bookId': currentBook.id,
    'type': type,
    'enable': true,
  }), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        pId: currentRow,
      });
    } else if (action === 2) {
      console.log(currentRow);
      setInitialValues({ ...currentRow });
    }
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    form.pId = form.pId.value;
    if (action === 1) {
      await create('categories', {...form, ...{ type: type }});
    } else if (action === 2) {
      await update('categories', currentRow.id, form);
    }
  };

  const title = () => {
    let title = translateAction(action);
    if (type === 'EXPENSE') {
      return title + t('tab.expense.category');
    }
    if (type === 'INCOME') {
      return title + t('tab.income.category');
    }
  }

  return (
    <MyModalForm
      title={title()}
      labelWidth={80}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={initialValues}
    >
      <ProFormTreeSelect
        name="pId"
        label={t('label.parent.category')}
        fieldProps={{
          ...treeSelectSingleProp,
          onFocus: loadCategories,
          loading: categoriesLoading,
          options: categories,
        }}
      />
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
    </MyModalForm>
  );
};
