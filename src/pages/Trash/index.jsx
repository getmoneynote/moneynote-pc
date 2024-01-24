import { PageContainer } from '@ant-design/pro-components';
import AccountTable from "./AccountTable";
import BookTable from "./BookTable";
import CategoryTable from "./CategoryTable";
import TagTable from "./TagTable";
import PayeeTable from "./PayeeTable";
import t from "@/utils/i18n";

export default () => {

  const tabItems = [
    { label: t('account'), key: 1, children: <AccountTable /> },
    { label: t('tab.expense.category'), key: 2, children: <CategoryTable type='EXPENSE' /> },
    { label: t('tab.income.category'), key: 3, children: <CategoryTable type='INCOME' /> },
    { label: t('tab.tag'), key: 4, children: <TagTable /> },
    { label: t('tab.payee'), key: 5, children: <PayeeTable /> },
    { label: t('book'), key: 6, children: <BookTable /> },
    // { label: t('group'), key: 7, children: <AccountTable /> },
  ];

  return (
    <PageContainer
      tabList={tabItems}
      tabProps={{
        tabBarStyle: { marginBottom: 20 }
      }}
    />
  );
};
