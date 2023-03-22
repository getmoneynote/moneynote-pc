import { useModel } from '@umijs/max';
import { PageContainer } from "@ant-design/pro-components";
import DataTable from "./DataTable";
import t from "@/utils/i18n";

export default () => {

  const { checkingActionRef, creditActionRef, assetActionRef, debtActionRef } = useModel('Account.model');

  const tabItems = [
    { label: t('checking.account'), key: 1, children: <DataTable type='CHECKING' actionRef={checkingActionRef} /> },
    { label: t('credit.account'), key: 2, children: <DataTable type='CREDIT' actionRef={creditActionRef} /> },
    { label: t('asset.account'), key: 3, children: <DataTable type='ASSET' actionRef={assetActionRef} /> },
    { label: t('debt.account'), key: 4, children: <DataTable type='DEBT' actionRef={debtActionRef} /> },
  ];

  return(
    <PageContainer
      tabList={tabItems}
      tabProps={{
        tabBarStyle: { marginBottom: 20 }
      }}
    />
  );

}
