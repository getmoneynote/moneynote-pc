import Pie from '@/components/charts/Pie';
import { Card } from 'antd';

export default ({ title, extra, data, loading }) => {
  return (
    <Card
      title={title}
      bordered={false}
      bodyStyle={{ padding: '40px 10px' }}
      style={{ height: '100%' }}
      extra={extra}
    >
      <Pie data={data} loading={loading} />
    </Card>
  );
};
