import { useEffect, useState } from 'react';
import { ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import MyModalForm from '@/components/MyModalForm';
import {create, update, query} from '@/services/category';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { action, currentRow } = useModel('modal');

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        pId: currentRow?.id,
      });
    } else if (action === 2) {
      setInitialValues({ ...currentRow });
    }
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    if (action === 1) {
      await create({...values, ...{ type: type }});
    } else if (action === 2) {
      await update(currentRow.id, values);
    }
  };

  const requestSelectData = async () => {
    const response = await query({
      type: type,
      enable: true
    });
    return response.data;
  }

  const title = () => {
    let title = action === 1 ? t('add') : t('update');
    if (type === 'EXPENSE') {
      title += t('tab.expense.category');
    }
    if (type === 'INCOME') {
      title += t('tab.income.category');
    }
    return title;
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
        request={requestSelectData}
        fieldProps={{
          ...treeSelectSingleProp,
        }}
      />
      <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
      <ProFormTextArea name="notes" label={t('label.notes')} />
    </MyModalForm>
  );
};
