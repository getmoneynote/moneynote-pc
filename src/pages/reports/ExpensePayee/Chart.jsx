import { useModel } from '@umijs/max';
import CardPie from '@/components/CardPie';
import t from '@/utils/i18n';

export default () => {

  const { data, loading } = useModel('reports.ExpensePayee.model');

  return <CardPie title={t('menu.report.expense.payee')} data={data} loading={loading} />;

};
