import {Button, Space} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import {useModel} from "@umijs/max";
import ActionForm from "@/pages/BalanceFlow/ActionForm";
import t from '@/utils/i18n';

export default () => {

  const { show } = useModel('modal');

  return (
    <Space size="large" style={{ width: "100%", justifyContent: "center" }}>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={ ()=>{ show(<ActionForm initType='EXPENSE' />) } }>{t('add') + t('expense')}</Button>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={ ()=>{ show(<ActionForm initType='INCOME' />) } }>{t('add') + t('income')}</Button>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={ ()=>{ show(<ActionForm initType='TRANSFER' />) } }>{t('add') + t('transfer')}</Button>
    </Space>
  );

};
