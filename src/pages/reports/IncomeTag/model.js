import { getIncomeTag } from '@/services/report';
import { useRequest } from '@umijs/max';

export default () => {

  const { data = [], loading, run } = useRequest(getIncomeTag, { manual: true });

  return {
    data,
    loading,
    run,
  };
};
