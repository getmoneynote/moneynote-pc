import { useEffect, useState } from 'react';
import {useModel, useRequest} from '@umijs/max';
import CardPie from '@/components/CardPie';
import { radioValueToTimeRange } from '@/utils/util';
import CardExtra from './CardExtra';

export default ({ request, title }) => {

  const { initialState } = useModel('@@initialState');

  const [timeRange, setTimeRange] = useState(7);
  function timeRangeChangeHandler(value) {
    setTimeRange(value);
  }

  const { data = [], loading, run } = useRequest(request, { manual: true });

  useEffect(() => {
    if (initialState.currentBook?.id) {
      const rangeValues = radioValueToTimeRange(timeRange);
      run({ book: initialState.currentBook.id, minTime: rangeValues[0].valueOf(), maxTime: rangeValues[1].valueOf() });
    }
  }, [timeRange, initialState.currentBook?.id]);

  return (
    <CardPie
      title={title}
      data={data}
      loading={loading}
      extra={<CardExtra value={timeRange} onChange={timeRangeChangeHandler} />}
    />
  );
};
