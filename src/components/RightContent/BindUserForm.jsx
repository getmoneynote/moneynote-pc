import { ProFormText } from '@ant-design/pro-components';
import { bind } from '@/services/user';
import { requiredRules } from '@/utils/rules';
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default () => {

  const successHandler = async () => {

  };

  const requestHandler = async (values) => {
    await bind(values);
  };

  return (
    <MyModalForm
      title={t('bind.user')}
      labelWidth={80}
      request={requestHandler}
      onSuccess={successHandler}
      initialValues={{}}
    >
      <ProFormText name="username" label={t('username.placeholder')} rules={requiredRules()} />
      <ProFormText.Password name="password" label={t('password.placeholder')} rules={requiredRules()} />
    </MyModalForm>
  );
};
