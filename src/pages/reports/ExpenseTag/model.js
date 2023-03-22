import { getExpenseTag } from '@/services/report';
import { useRequest } from '@umijs/max';

export default () => {
  const { data = [], loading, run } = useRequest(getExpenseTag, { manual: true });

  return {
    data,
    loading,
    run,
  };
};
