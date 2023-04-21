import { getExpenseCategory } from '@/services/report';
import { useRequest } from '@umijs/max';

export default () => {

  const { data = [], loading, run } = useRequest(getExpenseCategory, { manual: true });

  return {
    data,
    loading,
    run,
  };

};
