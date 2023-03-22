import {useRef} from 'react';

export default () => {

  const checkingActionRef = useRef();
  const creditActionRef = useRef();
  const assetActionRef = useRef();
  const debtActionRef = useRef();

  return {
    checkingActionRef,
    creditActionRef,
    assetActionRef,
    debtActionRef,
  };

};
