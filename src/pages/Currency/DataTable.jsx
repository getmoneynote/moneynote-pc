import {Button} from "antd";
import {useModel, useRequest} from "@umijs/max";
import { ProTable } from '@ant-design/pro-components';
import {query1, queryAll} from '@/services/common';
import {selectSingleProp, tableProp} from '@/utils/prop';
import {tableSortFormat} from "@/utils/util";
import {refresh} from "@/services/currency";
import t from "@/utils/i18n";


export default () => {

  const { initialState } = useModel('@@initialState');
  const { data : currencyOptions = [], loading : currencyLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });
  const { loading : refreshCurrencyLoading, run : runRefreshCurrency} = useRequest(refresh, { manual: true });

  const columns = [
    {
      title: t('account.label.currencyCode'),
      dataIndex: 'name',
      valueType: 'select',
      fieldProps: {
        ...selectSingleProp,
        options: currencyOptions,
        loading: currencyLoading,
        onFocus: loadCurrencies,
        labelInValue: false,
      },
    },
    {
      title: t('currency.base'),
      dataIndex: 'base',
      hideInTable: true,
      valueType: 'select',
      initialValue: initialState.currentGroup.defaultCurrencyCode,
      fieldProps: {
        ...selectSingleProp,
        allowClear: false,
        options: currencyOptions,
        loading: currencyLoading,
        onFocus: loadCurrencies,
        labelInValue: false,
      },
    },
    {
      title: t('account.rate'),
      dataIndex: 'rate2',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: t('currency.description'),
      dataIndex: 'description',
      hideInSearch: true,
    },
  ]

  return (
    <ProTable
      {...tableProp}
      toolBarRender={() => [
        <Button type="primary" onClick={runRefreshCurrency} loading={refreshCurrencyLoading}>
          {t('account.refresh.currency')}
        </Button>,
      ]}
      columns={columns}
      request={ (params = {}, sort, _) => query1('currencies', { ...params, ...{ sort: tableSortFormat(sort) } }) }
    />
  );

};
