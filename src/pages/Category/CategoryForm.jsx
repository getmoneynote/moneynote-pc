import { useEffect, useState } from 'react';
import { ProFormText, ProFormTextArea, ProFormTreeSelect, ProFormDigit } from '@ant-design/pro-components';
import {useModel, useRequest} from '@umijs/max';
import MyModalForm from '@/components/MyModalForm';
import {create, update, queryAll} from '@/services/common';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import {translateAction} from "@/utils/util";
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { action, currentRow, visible } = useModel('modal');
  const { bookId } = useModel('Category.model');

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => queryAll('categories', {
    'bookId': bookId,
    'type': type,
  }), { manual: true });
  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        parent: currentRow,
      });
    } else if (action === 2) {
      setInitialValues({ ...currentRow });
    }
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    // 修改是pid为数值
    form.pId = values.parent?.value;
    delete form.parent;
    if (action === 1) {
      await create('categories', {...form, ...{ bookId: bookId, type: type }});
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
        name="parent"
        label={t('label.parent.category')}
        fieldProps={{
          ...treeSelectSingleProp,
          loading: categoriesLoading,
          options: categories,
        }}
      />
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
      <ProFormDigit name="sort" label={t('sort')} />
    </MyModalForm>
  );
};
