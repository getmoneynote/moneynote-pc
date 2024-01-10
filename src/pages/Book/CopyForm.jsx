import { useState } from 'react';
import { useModel } from '@umijs/max';
import { ProFormText } from '@ant-design/pro-components';
import { copy } from '@/services/book';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const { actionRef } = useModel('Book.model');
  const { currentRow } = useModel('modal');

  const [initialValues] = useState({});

  const requestHandler = async (values) => {
    await copy({
      ...values,
      ...{
        bookId: currentRow.id
      }
    });
  };

  const successHandler = async () => {
    actionRef.current?.reload();
  };

  return (
    <>
      <MyModalForm
        title={t('copy') + currentRow.name}
        labelWidth={90}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormText name="bookName" label={t('book.copy.name')} rules={requiredRules()} />
      </MyModalForm>
    </>
  );
};
