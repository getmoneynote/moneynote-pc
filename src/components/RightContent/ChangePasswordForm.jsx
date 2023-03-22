import { ProFormText } from '@ant-design/pro-components';
import { changePassword } from '@/services/user';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

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
      labelWidth={80}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={{}}
    >
      <ProFormText name="oldPassword" label={t('old.password')} rules={requiredRules()} />
      <ProFormText name="newPassword" label={t('new.password')} rules={requiredRules()} />
    </MyModalForm>
  );
};
