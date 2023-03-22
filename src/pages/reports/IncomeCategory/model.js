import { getIncomeCategory } from '@/services/report';
import { useRequest } from '@umijs/max';

export default () => {
  const { data = [], loading, run } = useRequest(getIncomeCategory, { manual: true });

  return {
    data,
    loading,
    run,
  };
};
