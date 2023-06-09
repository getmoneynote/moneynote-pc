import {useRef} from "react";
import {Button} from "antd";
import {SelectLang} from '@umijs/max';
import {LockOutlined, UserOutlined, WechatOutlined} from '@ant-design/icons';
import {LoginForm, ProFormCheckbox, ProFormText} from '@ant-design/pro-components';
import { login, wxLoginUrl } from '@/services/user';
import { requiredRules } from '@/utils/rules';
import Footer from '@/components/Footer';
import t from '@/utils/i18n';
import styles from '../index.less';


export default () => {

  const formRef = useRef();

  const handleSubmit = async (values) => {
    const response = await login({ ...values });
    if (response.data.remember) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    setTimeout(() => {
      window.location.href = '/report';
    }, 300);
  };

  const windowRef = useRef(null);
  const handleWechat = async () => {
    const response = await wxLoginUrl();
    if (response.success) {
      window.removeEventListener('message', handleMessage, false);
      if (windowRef.current) {
        windowRef.current.close();
      }
      window.addEventListener('message', handleMessage, false);
      windowRef.current = window.open(
        response.data,
        '_blank',
        'top=150,left=300,width=600,height=500'
      );
      let intervalId = window.setInterval(() => {
        if (windowRef.current?.closed) {
          clearInterval(intervalId);
          window.removeEventListener('message', handleMessage, false);
        }
      }, 2000);
    }
  }
  const handleMessage = (e) => {
    if (e.origin !== window.location.origin) return;
    // 关闭微信登录窗口
    if (windowRef.current) {
      windowRef.current.close();
    }
    if (formRef.current?.getFieldValue('remember')) {
      localStorage.setItem('accessToken', e.data);
    }
    window.location.href = '/report';
  }

  // const handleWechat2 = async () => {
  //   show(<WxLoginModal />)
  // }

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          formRef={formRef}
          logo={<img alt="logo" src="/logo.svg" />}
          title="九快记账"
          subTitle="记账是一种生活态度"
          initialValues={{
            remember: false,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            rules={requiredRules()}
            placeholder={t('username.placeholder')}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            rules={requiredRules()}
            placeholder={t('password.placeholder')}
          />
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="remember">{t('login.remember')}</ProFormCheckbox>
          </div>
        </LoginForm>
        <div className={styles.loginFormAction}>
          <Button type="link" icon={<WechatOutlined />} onClick={handleWechat}>{t('wechat.login')}</Button>
          <a href="/user/register">{t('register.account')}</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};
