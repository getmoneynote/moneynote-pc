import { useEffect, useState } from 'react';
import { useRequest } from '@umijs/max';
import CardPie from '@/components/CardPie';
import { radioValueToTimeRange } from '@/utils/util';
import CardExtra from './CardExtra';

export default ({ request, title }) => {

  const [timeRange, setTimeRange] = useState(7);
  function timeRangeChangeHandler(value) {
    setTimeRange(value);
  }

  const { data = [], loading, run } = useRequest(request, { manual: true });

  useEffect(() => {
    const rangeValues = radioValueToTimeRange(timeRange);
    run({ minTime: rangeValues[0].valueOf(), maxTime: rangeValues[1].valueOf() });
  }, [timeRange]);

  return (
    <CardPie
      title={title}
      data={data}
      loading={loading}
      extra={<CardExtra value={timeRange} onChange={timeRangeChangeHandler} />}
    />
  );
};
