import { Avatar, Spin } from 'antd';
import {LockOutlined, LogoutOutlined} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import HeaderDropdown from '../HeaderDropdown';
import ChangePasswordForm from './ChangePasswordForm';
import BindUserForm from './BindUserForm';
import { logout } from '@/services/user';
import t from '@/utils/i18n';
import styles from './index.less';

const AvatarDropdown = () => {

  const { initialState } = useModel('@@initialState');
  const { show } = useModel('modal');

  const onMenuClick = async ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('accessToken');
      // await logout();
      window.location.href = '/user/login';
    }
    if (key === 'changePassword') {
      show(<ChangePasswordForm />);
    }
    if (key === 'bind') {
      show(<BindUserForm />);
    }
  };

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
    // {
    //   key: 'bind',
    //   icon: <UserAddOutlined />,
    //   label: t('bind.user'),
    // },
    {
      key: 'changePassword',
      icon: <LockOutlined />,
      label: t('change.password'),
      disabled: !currentUser.username
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
        <Avatar size="small" className={styles.avatar} src={currentUser.headimgurl ?? 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
