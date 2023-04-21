import { useModel } from '@umijs/max';
import CardPie from '@/components/CardPie';
import t from '@/utils/i18n';

export default () => {

  const { data, loading } = useModel('reports.ExpenseCategory.model');

  return <CardPie title={t('menu.report.expense.category')} data={data} loading={loading} />;

};
