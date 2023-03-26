import { Card } from 'antd';
import {
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  QueryFilter,
} from '@ant-design/pro-components';
import { useRequest } from "@umijs/max";
import moment from 'moment/moment';
import { selectSearchProp, treeSelectMultipleProp } from '@/utils/prop';
import { getAll } from '@/services/common';
import t from '@/utils/i18n';


export default ({ type, cat, run }) => {

  const { data : categories = [], loading : categoriesLoading, run : loadCategories} = useRequest(() => getAll('categories'), { manual: true });
  const { data : tags = [], loading : tagsLoading, run : loadTags} = useRequest(() => getAll('tags'), { manual: true });
  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(() => getAll('payees'), { manual: true });

  return (
    <Card>
      <QueryFilter
        defaultCollapsed={false}
        onFinish={(values) => {
          if (values.categories) values.categories = values.categories.map((i) => i?.value || i);
          if (values.tags) values.tags = values.tags.map((i) => i?.value || i);
          run(values);
        }}
      >
        <ProFormDateRangePicker
          name="dateRange"
          label={t('flow.label.createTime')}
          transform={(value) => ({
            minTime: moment(value[0]).startOf('day').valueOf(),
            maxTime: moment(value[1]).endOf('day').valueOf(),
          })}
          fieldProps={{
            allowEmpty: [true, true],
            ranges: {
              Today: [moment().startOf('day'), moment().endOf('day')],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'This Year': [moment().startOf('year'), moment().endOf('year')],
              'Last Year': [
                moment().add(-1, 'years').startOf('year'),
                moment().add(-1, 'years').endOf('year'),
              ],
            },
          }}
        />
        <ProFormText name="title" label={t('flow.label.title')} />
        <ProFormSelect
          name="payees"
          label={t('flow.label.payee')}
          fieldProps={{
            options: type === 1 ? payees.filter(i => i.canExpense) : payees.filter(i => i.canIncome),
            loading: payeesLoading,
            onFocus: loadPayees,
            ...selectSearchProp,
          }}
        />
        <ProFormTreeSelect
          name="categories"
          label={t('flow.label.category')}
          fieldProps={{
            options: type === 1 ? categories.filter(i => i.canExpense) : categories.filter(i => i.canIncome),
            loading: categoriesLoading,
            onFocus: loadCategories,
            ...treeSelectMultipleProp,
            treeCheckStrictly: cat === 1,
          }}
        />
        <ProFormTreeSelect
          name="tags"
          label={t('flow.label.tag')}
          fieldProps={{
            loading: tagsLoading,
            options: type === 1 ? tags.filter(i => i.canExpense) : tags.filter(i => i.canIncome),
            onFocus: loadTags,
            ...treeSelectMultipleProp,
            treeCheckStrictly: cat === 2,
          }}
        />
      </QueryFilter>
    </Card>
  );
};
