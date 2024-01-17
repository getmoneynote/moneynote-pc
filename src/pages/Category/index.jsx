import { useEffect } from "react";
import { PageContainer } from '@ant-design/pro-components';
import { useModel, useSearchParams } from "@umijs/max";
import CategoryTable from './CategoryTable';
import PayeeTable from './PayeeTable';
import TagTable from './TagTable';
import t from '@/utils/i18n';

export default () => {

  const { initialState } = useModel('@@initialState');
  const { expenseCategoryActionRef, incomeCategoryActionRef, setBookId } = useModel('Category.model');
  const [ searchParams ] = useSearchParams();

  useEffect(() => {
    setBookId(searchParams.get('bookId') ?? initialState.currentBook.id);
  }, [initialState?.currentBook, searchParams]);

  const tabItems = [
    { label: t('tab.expense.category'), key: 1, children: <CategoryTable type='EXPENSE' actionRef={expenseCategoryActionRef} /> },
    { label: t('tab.income.category'), key: 2, children: <CategoryTable type='INCOME' actionRef={incomeCategoryActionRef} /> },
    { label: t('tab.tag'), key: 3, children: <TagTable /> },
    { label: t('tab.payee'), key: 4, children: <PayeeTable /> },
  ];

  return (
    <PageContainer
      title={ searchParams.get('bookName') ?? initialState.currentBook.name}
      tabList={tabItems}
      tabProps={{
        tabBarStyle: { marginBottom: 20 },
      }}
    />
  );
};
