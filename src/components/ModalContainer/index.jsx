import { useModel } from '@umijs/max';

// https://blog.logrocket.com/build-modal-with-react-portals/
export default () => {

  const { content } = useModel('modal');

  return content;

}
