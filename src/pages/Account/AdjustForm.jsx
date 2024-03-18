import {useEffect, useState} from "react";
import {useModel, useRequest} from '@umijs/max';
import {ProFormText, ProFormTextArea, ProFormDateTimePicker, ProFormSelect} from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import moment from "moment/moment";
import { createAdjust, updateAdjust } from '@/services/account';
import {amountRequiredRules, requiredRules} from "@/utils/rules";
import {selectSingleProp} from "@/utils/prop";
import {queryAll} from "@/services/common";
import t from '@/utils/i18n';
import {dateFormatStr1} from "@/utils/util";


export default ({ actionRef }) => {

  const { action, currentRow } = useModel('modal');
  const { initialState } = useModel('@@initialState');

  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => queryAll('books'), { manual: true });

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      setInitialValues({
        'book': initialState.currentBook,
        'createTime': moment(),
        'balance': currentRow.balance.toString(),
      });
    } else if (action === 2) {
      setInitialValues({
        ...currentRow,
      });
    }
  }, [action, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    form.book = form.book.value;
    if (action === 1) {
      await createAdjust(currentRow.id, form);
    } else if (action === 2) {
      await updateAdjust(currentRow.id, form);
    }
  }

  return (
    <>
      <MyModalForm
        title={`${action ===2 ? t('update') : ''}${action === 1 ? currentRow.name + ' ' : ''}${t('adjust.balance')}`}
        labelWidth={80}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormSelect
          name="book"
          label={t('flow.label.book')}
          rules={requiredRules()}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadBooks,
            options: books,
            loading: booksLoading,
            allowClear: false,
          }}
        />
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormDateTimePicker name="createTime" format={dateFormatStr1()} label={t('flow.label.createTime')} allowClear={false} rules={requiredRules()} />
        {
          action === 1 &&
          <ProFormText name="balance" label={t('account.label.balance')} rules={amountRequiredRules()} />
        }
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
}
