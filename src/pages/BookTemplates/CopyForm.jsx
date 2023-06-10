import { useState } from 'react';
import { useModel } from '@umijs/max';
import { ProFormText } from '@ant-design/pro-components';
import { createByTemplate } from '@/services/book';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { currentRow } = useModel('modal');

  const [initialValues] = useState({});

  const requestHandler = async (values) => {
    await createByTemplate({
      ...values,
      ...{
        templateId: currentRow.id
      }
    });
  };

  return (
    <>
      <MyModalForm
        title={t('copy') + currentRow.name}
        labelWidth={90}
        request={requestHandler}
        initialValues={initialValues}
      >
        <ProFormText name="bookName" label={t('book.copy.name')} rules={requiredRules()} />
      </MyModalForm>
    </>
  );
};
