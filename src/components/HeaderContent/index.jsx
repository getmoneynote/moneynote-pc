import {useEffect, useState} from "react";
import {Button, Space, Select} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {useModel, useRequest} from "@umijs/max";
import {getBooksSelect, setDefaultGroupAndBook} from "@/services/user";
import ActionForm from "@/pages/Book/ActionForm";
import t from '@/utils/i18n';

export default () => {

  const { show } = useModel('modal');
  const { initialState, setInitialState } = useModel('@@initialState');

  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => getBooksSelect(), { manual: false });

  const [bookValue, setBookValue] = useState();
  useEffect(() => {
    if(books && books.length > 0) {
      setBookValue(initialState.currentGroup.id + '-' + initialState.currentBook.id)
    }
  }, [books])
  useEffect(() => {
    if(books && books.length > 0) {
      setBookValue(initialState.currentGroup.id + '-' + initialState.currentBook.id)
    }
  }, [bookValue])

  const handleChange = async (value) => {
    const res = await setDefaultGroupAndBook(value);
    if (res.success) {
      window.location.reload();
    }
  };

  return (
    <Space size="large" style={{ width: "100%", height: "100%", justifyContent: "center", alignContent: "center" }}>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={ ()=>{ show(<ActionForm initType='EXPENSE' />) } }>{t('add') + t('expense')}</Button>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={ ()=>{ show(<ActionForm initType='INCOME' />) } }>{t('add') + t('income')}</Button>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={ ()=>{ show(<ActionForm initType='TRANSFER' />) } }>{t('add') + t('transfer')}</Button>
      <Select
        style={{ width: 'auto' }}
        value={bookValue}
        labelInValue={false}
        options={books}
        loading={booksLoading}
        allowClear={false}
        onChange={handleChange}
      />
    </Space>
  );

};
