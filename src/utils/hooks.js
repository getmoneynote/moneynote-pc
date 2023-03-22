import { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';

export function useMsg(id) {
  const intl = useIntl();
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setSuccessMsg(intl.formatMessage({ id : id ? id : 'message.operation.success'}));
  }, []);

  return {successMsg};
}
