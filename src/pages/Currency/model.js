import { useRef } from 'react';

export default () => {
  const actionRef = useRef();

  return {
    actionRef,
  };
};
