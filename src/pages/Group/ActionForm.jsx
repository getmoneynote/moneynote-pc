import {useEffect, useState} from 'react';
import {useModel, useRequest} from '@umijs/max';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import {create, update, queryAll} from '@/services/common';
import { selectSingleProp } from '@/utils/prop';
import { translateAction } from '@/utils/util';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';


export default () => {

  const { actionRef } = useModel('Group.model');
  const { action, currentRow } = useModel('modal');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });

  const { data : templates = [], loading: templatesLoading, run: loadTemplates } = useRequest(() => queryAll('book-templates'), { manual: true });

  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => queryAll('books'), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({

      });
    } else {
      setInitialValues({
        ...currentRow,
      });
    }
  }, [action, currentRow]);

  const successHandler = async () => {
    actionRef.current?.reload();
  };

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    if (action !== 2) {
      // 修改是pid为数值
      form.templateId = values.templateId?.value;
      await create('groups', form);
    } else {
      form.defaultBookId = form.defaultBook.value;
      delete form.defaultBook;
      await update('groups', currentRow.id, form);
    }
  };

  return (
    <>
      <MyModalForm
        title={ translateAction(action) + t('group') }
        labelWidth={95}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormText name="name" label={t('label.name')} rules={requiredRules()} />
        <ProFormSelect
          name="defaultCurrencyCode"
          label={t('account.label.currencyCode')}
          rules={requiredRules()}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadCurrencies,
            loading: currenciesLoading,
            options: currencies,
            allowClear: false,
            labelInValue: false,
          }}
        />
        {
          action === 1 &&
          <ProFormSelect
            name="templateId"
            label={t('menu.bookTemplates')}
            rules={requiredRules()}
            fieldProps={{
              ...selectSingleProp,
              onFocus: loadTemplates,
              loading: templatesLoading,
              options: templates,
              allowClear: false,
            }}
          />
        }
        {
          action === 2 &&
          <ProFormSelect
            name="defaultBook"
            label={t('group.label.default.book')}
            rules={requiredRules()}
            fieldProps={{
              ...selectSingleProp,
              onFocus: loadBooks,
              loading: booksLoading,
              options: books,
              allowClear: false,
            }}
          />
        }
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
};
