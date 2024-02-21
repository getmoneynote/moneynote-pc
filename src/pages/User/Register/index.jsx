import {useEffect, useRef, useState} from "react";
import { LockOutlined, UserOutlined, VerifiedOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import {SelectLang, useRequest, getLocale} from '@umijs/max';
import {register} from '@/services/user';
import { allBookTemplates } from "@/services/book";
import { requiredRules } from '@/utils/rules';
import Footer from '@/components/Footer';
import {selectSingleProp} from "@/utils/prop";
import t from '@/utils/i18n';
import styles from '../index.less';


export default () => {

  const formRef = useRef();

  const handleSubmit = async (values) => {
    let form = JSON.parse(JSON.stringify(values));
    form.templateId = form.templateId?.id;
    await register(form);
  };

  const { data : bookTemplates = [], loading : bookTemplatesLoading} = useRequest(() => allBookTemplates(getLocale()), { manual: false });

  const [defaultTemplate, setDefaultTemplate] = useState();

  useEffect(() => {
    formRef.current?.setFieldsValue({
      templateId: bookTemplates[0]
    });
  }, [bookTemplates]);



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
          formRef={formRef}
        >
          <ProFormText
            name="username"
            label={t('username.placeholder')}
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
            label={t('password.placeholder')}
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
            label={t('invite.code.placeholder')}
            fieldProps={{
              size: 'large',
              prefix: <VerifiedOutlined className={styles.prefixIcon} />,
            }}
            rules={requiredRules()}
            placeholder={t('invite.code.placeholder')}
          />
          <ProFormSelect
            name="templateId"
            label={t('register.template')}
            fieldProps={{
              ...selectSingleProp,
              allowClear: false,
              loading: bookTemplatesLoading,
              options: bookTemplates,
            }}
            rules={requiredRules()}
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
