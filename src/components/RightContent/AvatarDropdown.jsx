import { useCallback } from 'react';
import { Avatar, Menu, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import HeaderDropdown from '../HeaderDropdown';
import ChangePasswordForm from './ChangePasswordForm';
import t from '@/utils/i18n';
import styles from './index.less';

const AvatarDropdown = () => {

  const { initialState, setInitialState } = useModel('@@initialState');
  const { show } = useModel('modal');

  const onMenuClick = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'logout') {
        localStorage.removeItem('accessToken');
        window.location.href = '/user/login';
      } else if (key === 'changePassword') {
        show(<ChangePasswordForm />);
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuItems = [
    {
      key: 'changePassword',
      icon: <LogoutOutlined />,
      label: t('change.password'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('logout'),
    },
  ];

  return (
    <HeaderDropdown menu={{
      selectedKeys: [],
      onClick: onMenuClick,
      items: menuItems,
    }}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
