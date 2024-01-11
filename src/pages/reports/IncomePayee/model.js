import { getIncomePayee } from '@/services/report';
import { useRequest } from '@umijs/max';

export default () => {

  const { data = [], loading, run } = useRequest(getIncomePayee, { manual: true });

  return {
    data,
    loading,
    run,
  };

};
