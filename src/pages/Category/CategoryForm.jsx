import { useEffect, useState } from 'react';
import { ProFormText, ProFormTextArea, ProFormTreeSelect } from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import MyModalForm from '@/components/MyModalForm';
import {create, update, query} from '@/services/common';
import { treeSelectSingleProp } from '@/utils/prop';
import { requiredRules } from '@/utils/rules';
import {translateAction} from "@/utils/util";
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
      await create('categories', {...values, ...{ type: type }});
    } else if (action === 2) {
      await update('categories', currentRow.id, values);
    }
  };

  const requestSelectData = async () => {
    const response = await query('categories', {
      type: type,
      enable: true
    });
    return response.data;
  }

  const title = () => {
    let title = translateAction(action);
    if (type === 'EXPENSE') {
      return  title + t('tab.expense.category');
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
