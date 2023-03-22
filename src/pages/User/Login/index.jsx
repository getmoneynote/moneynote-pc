import { message } from 'antd';
import { SelectLang } from '@umijs/max';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { login } from '@/services/user';
import { requiredRules } from '@/utils/rules';
import Footer from '@/components/Footer';
import t from '@/utils/i18n';
import styles from '../index.less';

export default () => {
  const defaultLoginSuccessMessage = t('pages.login.success');
  const handleSubmit = async (values) => {
    const response = await login({ ...values });
    if (response.data.remember) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    message.success(defaultLoginSuccessMessage);
    window.location.href = '/report';
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="九快记账"
          subTitle="记账管理系统"
          initialValues={{
            remember: true,
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
            <ProFormCheckbox noStyle name="remember">
              {t('pages.login.rememberMe')}
            </ProFormCheckbox>
            <a style={{ float: 'right' }}>{t('pages.login.forgotPassword')}</a>
          </div>
        </LoginForm>
        <div style={{ textAlign: 'center' }}>
          <a href="/user/register">{t('register.account')}</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};
