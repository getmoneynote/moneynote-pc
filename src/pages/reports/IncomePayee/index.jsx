import { Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { spaceVProp } from '@/utils/prop';
import FlowFilter from '../components/FlowFilter';
import Chart from './Chart';

export default () => {
  const { run } = useModel('reports.IncomePayee.model');

  return (
    <PageContainer title={false}>
      <Space {...spaceVProp}>
        <FlowFilter type='Income' run={run} />
        <Chart />
      </Space>
    </PageContainer>
  );
};
