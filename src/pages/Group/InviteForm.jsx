import {useModel} from "@umijs/max";
import {
  ProFormText,
} from '@ant-design/pro-components';
import MyModalForm from '@/components/MyModalForm';
import { inviteUser } from '@/services/group';
import { requiredRules } from '@/utils/rules';
import t from '@/utils/i18n';


export default () => {

  const { currentRow } = useModel('modal');

  const successHandler = async () => {

  };

  const requestHandler = async (values) => {
    await inviteUser(currentRow.id, values.username);
  };

  return (
    <>
      <MyModalForm
        title={ t('group.invite.user') }
        labelWidth={95}
        request={requestHandler}
        onSuccess={successHandler}
      >
        <ProFormText name="username" label={t('username.placeholder')} rules={requiredRules()} />
      </MyModalForm>
    </>
  );
};
