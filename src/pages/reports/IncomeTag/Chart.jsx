import { useEffect } from 'react';
import { useModel } from '@umijs/max';
import CardPie from '@/components/CardPie';
import t from '@/utils/i18n';

export default () => {
  const { data, loading, run } = useModel('reports.IncomeTag.model');

  useEffect(run, []);

  return <CardPie title={t('menu.report.income.tag')} data={data} loading={loading} />;
};
