import { Dropdown } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export default ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown
    overlayClassName={classNames(styles.container, cls)}
    getPopupContainer={(target) => target.parentElement || document.body}
    {...restProps}
  />
);

