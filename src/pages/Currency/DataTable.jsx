import {Button} from "antd";
import {useModel, useRequest} from "@umijs/max";
import { ProTable } from '@ant-design/pro-components';
import {query1, queryAll} from '@/services/common';
import {selectSingleProp, tableProp} from '@/utils/prop';
import {tableSortFormat} from "@/utils/util";
import {refresh} from "@/services/currency";
import RateForm from './RateForm';
import t from "@/utils/i18n";


export default () => {

  const { data : currencyOptions = [], loading : currencyLoading, run : loadCurrencies} = useRequest(() => queryAll('currencies'), { manual: true });
  const { loading : refreshCurrencyLoading, run : runRefreshCurrency} = useRequest(refresh, { manual: true });
  const { show } = useModel('modal');
  const { actionRef } = useModel('Currency.model');

  const changeRate = (record) => {
    show(<RateForm item={record} />, 2, record)
  };

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
      initialValue: 'USD',
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
    {
      title: t('operation'),
      align: 'center',
      hideInSearch: true,
      width: 250,
      render: (_, record) => [
        <Button size="small" type="link" onClick={() => changeRate(record)}>
          {t('currency.update')}
        </Button>,
      ],
    },
  ]

  return (
    <ProTable
      {...tableProp}
      actionRef={actionRef}
      toolBarRender={() => [
        <Button
          type="primary"
          onClick={async () => {
            await runRefreshCurrency();
            actionRef.current?.reload();
          }}
          loading={refreshCurrencyLoading}
        >
          {t('account.refresh.currency')}
        </Button>,
      ]}
      columns={columns}
      request={ (params = {}, sort, _) => query1('currencies', { ...params, ...{ sort: tableSortFormat(sort) } }) }
    />
  );

};
