import { useRequest } from '@umijs/max';
import { StatisticCard } from '@ant-design/pro-components';
import { overview } from '@/services/account';
import t from '@/utils/i18n';

export default () => {
  const { data = [0, 0, 0], loading } = useRequest(overview);

  return (
    <StatisticCard.Group direction={'row'}>
      <StatisticCard
        loading={loading}
        statistic={{
          title: t('asset'),
          value: data[0],
          valueStyle: { color: '#14ba89' },
        }}
      />
      <StatisticCard.Divider type={'vertical'} />
      <StatisticCard
        loading={loading}
        statistic={{
          title: t('debt'),
          value: data[1],
          valueStyle: { color: '#f1523a' },
        }}
      />
      <StatisticCard.Divider type={'vertical'} />
      <StatisticCard
        loading={loading}
        statistic={{
          title: t('net.worth'),
          value: data[2],
          valueStyle: { color: '#2e2e2e' },
        }}
      />
    </StatisticCard.Group>
  );
};
