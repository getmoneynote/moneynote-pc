import {useRef, useState} from 'react';

export default () => {

  const expenseCategoryActionRef = useRef();
  const incomeCategoryActionRef = useRef();
  const tagActionRef = useRef();
  const payeeActionRef = useRef();
  const [bookId, setBookId] = useState();

  return {
    expenseCategoryActionRef,
    incomeCategoryActionRef,
    tagActionRef,
    payeeActionRef,
    bookId, setBookId,
  };

};
