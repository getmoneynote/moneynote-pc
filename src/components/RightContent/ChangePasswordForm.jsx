import { ProFormText } from '@ant-design/pro-components';
import { changePassword } from '@/services/user';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';
import {LockOutlined} from "@ant-design/icons";
import styles from "@/pages/User/index.less";

export default () => {

  const successHandler = async () => {
    localStorage.removeItem('accessToken');
    setTimeout(function () {
      window.location.href = '/user/login';
    }, 500);
  };

  const requestHandler = async (values) => {
    await changePassword(values);
  };

  return (
    <MyModalForm
      title={t('change.password')}
      labelWidth={90}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={{}}
    >
      <ProFormText.Password
        name="oldPassword"
        label={t('old.password')}
        rules={requiredRules()}
        fieldProps={{
          size: 'large',
          autoComplete: 'new-password',
        }}
      />
      <ProFormText.Password
        name="newPassword"
        label={t('new.password')}
        rules={requiredRules()}
        fieldProps={{
          size: 'large',
          autoComplete: 'new-password',
        }}
      />
    </MyModalForm>
  );
};
