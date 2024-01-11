import { useModel } from '@umijs/max';
import CardPie from '@/components/CardPie';
import t from '@/utils/i18n';

export default () => {

  const { data, loading } = useModel('reports.IncomePayee.model');

  return <CardPie title={t('menu.report.income.payee')} data={data} loading={loading} />;

};
