import { getExpensePayee } from '@/services/report';
import { useRequest } from '@umijs/max';

export default () => {

  const { data = [], loading, run } = useRequest(getExpensePayee, { manual: true });

  return {
    data,
    loading,
    run,
  };

};
