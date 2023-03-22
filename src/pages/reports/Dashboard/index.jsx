import { Col, Row, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { getExpenseCategory, getIncomeCategory } from '@/services/report';
import { spaceVProp } from '@/utils/prop';
import AssetBar from './AssetBar';
import BalanceSheet from './BalanceSheet';
import DonutCategory from './DonutCategory';
import t from '@/utils/i18n';
import styles from './index.less';

export default () => {
  return (
    <PageContainer title={false}>
      <Space {...spaceVProp}>
        <AssetBar />
        <BalanceSheet />
        <Row gutter={12} className={styles['pie-row']}>
          <Col span={12}>
            <DonutCategory title={t('tab.expense.category')} request={getExpenseCategory} />
          </Col>
          <Col span={12}>
            <DonutCategory title={t('tab.income.category')} request={getIncomeCategory} />
          </Col>
        </Row>
      </Space>
    </PageContainer>
  );
};
