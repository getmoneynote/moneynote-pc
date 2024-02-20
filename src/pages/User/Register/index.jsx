import { LockOutlined, UserOutlined, VerifiedOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { SelectLang } from '@umijs/max';
import { register } from '@/services/user';
import { requiredRules } from '@/utils/rules';
import Footer from '@/components/Footer';
import t from '@/utils/i18n';
import styles from '../index.less';

export default () => {

  const handleSubmit = async (values) => {
    await register({ ...values });
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="MoneyNote"
          subTitle="  "
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
          submitter={{
            searchConfig: {
              submitText: t('register.account'),
            },
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              autoComplete: 'off',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            rules={requiredRules()}
            placeholder={t('username.placeholder')}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              autoComplete: 'new-password',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            rules={requiredRules()}
            placeholder={t('password.placeholder')}
          />
          <ProFormText
            name="inviteCode"
            fieldProps={{
              size: 'large',
              prefix: <VerifiedOutlined className={styles.prefixIcon} />,
            }}
            rules={requiredRules()}
            placeholder={t('invite.code.placeholder')}
          />
        </LoginForm>
        <div style={{ textAlign: 'center' }}>
          <a href="/user/login">{t('has.account.login')}</a>
        </div>
      </div>
      <Footer />
    </div>
  );
};
