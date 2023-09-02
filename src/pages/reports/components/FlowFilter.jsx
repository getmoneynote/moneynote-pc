import {useState, useEffect, useRef} from "react";
import { Card } from 'antd';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  QueryFilter,
} from '@ant-design/pro-components';
import {useModel, useRequest} from "@umijs/max";
import moment from 'moment/moment';
import {selectMultipleProp, selectSingleProp, treeSelectMultipleProp} from '@/utils/prop';
import {datePickerRanges} from '@/utils/util';
import { queryAll } from '@/services/common';
import {requiredRules} from "@/utils/rules";
import t from '@/utils/i18n';

// type是支出和收入，cat是分类还是标签
export default ({ type, run }) => {

  const formRef = useRef();
  const { initialState } = useModel('@@initialState');
  const [currentBook, setCurrentBook] = useState(initialState.currentBook);
  const { data : books = [], loading: booksLoading, run: loadBooks } = useRequest(() => queryAll('books'), { manual: true });

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => queryAll('categories', {
    'bookId': currentBook.id,
    'type': type,
  }), { manual: true });
  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => queryAll('tags', {
    'bookId': currentBook.id,
    'canExpense': type === 'EXPENSE' ? true : null,
    'canIncome': type === 'INCOME' ? true : null,
  }), { manual: true });
  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(() => queryAll('payees', {
    'bookId': currentBook.id,
    'canExpense': type === 'EXPENSE' ? true : null,
    'canIncome': type === 'INCOME' ? true : null,
  }), { manual: true });

  useEffect(() => {
    if (initialState.currentBook?.id) {
      formRef.current?.submit();
    }
  }, []);

  return (
    <Card>
      <QueryFilter
        formRef={formRef}
        defaultCollapsed={false}
        onFinish={(values) => {
          let form = JSON.parse(JSON.stringify(values));
          form.bookId = values.bookId.id;
          if (values.categories) form.categories = values.categories.map((i) => i?.value || i);
          if (values.tags) form.tags = values.tags.map((i) => i?.value || i);
          run(form);
        }}
      >
        <ProFormSelect
          name="bookId"
          label={t('flow.label.book')}
          rules={requiredRules()}
          onChange={(_, option) => {
            setCurrentBook(option);
          }}
          initialValue={currentBook}
          fieldProps={{
            ...selectSingleProp,
            onFocus: loadBooks,
            options: books,
            loading: booksLoading,
            allowClear: false,
            labelInValue: true,
          }}
        />
        <ProFormDateRangePicker
          name="dateRange"
          label={t('flow.label.createTime')}
          transform={(value) => ({
            minTime: moment(value[0]).startOf('day').valueOf(),
            maxTime: moment(value[1]).endOf('day').valueOf(),
          })}
          fieldProps={{
            allowEmpty: [true, true],
            ranges: datePickerRanges(),
          }}
        />
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormSelect
          name="payees"
          label={t('flow.label.payee')}
          fieldProps={{
            ...selectMultipleProp,
            options: payees,
            loading: payeesLoading,
            onFocus: loadPayees,
          }}
        />
        <ProFormTreeSelect
          name="categories"
          label={t('flow.label.category')}
          fieldProps={{
            ...treeSelectMultipleProp,
            options: categories,
            loading: categoriesLoading,
            onFocus: loadCategories,
            // treeCheckStrictly: cat === 1,
          }}
        />
        <ProFormTreeSelect
          name="tags"
          label={t('flow.label.tag')}
          fieldProps={{
            ...treeSelectMultipleProp,
            loading: tagsLoading,
            options: tags,
            onFocus: loadTags,
            // treeCheckStrictly: cat === 2,
          }}
        />
      </QueryFilter>
    </Card>
  );
};
