import {useRef} from 'react';

export default () => {

  const expenseCategoryActionRef = useRef();
  const incomeCategoryActionRef = useRef();
  const tagActionRef = useRef();
  const payeeActionRef = useRef();

  return {
    expenseCategoryActionRef,
    incomeCategoryActionRef,
    tagActionRef,
    payeeActionRef,
  };

};
