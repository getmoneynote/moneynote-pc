import t from '@/utils/i18n';
import { DataView } from '@antv/data-set';
import { Divider, Empty, Spin } from 'antd';
import { Annotation, Chart, Coord, Interval, Legend, Tooltip } from 'bizcharts';
import { useEffect, useState } from 'react';
import styles from './index.less';

export default (props) => {
  const { data, loading = false } = props;

  const dv = new DataView();
  dv.source(data).transform({
    type: 'percent',
    field: 'y',
    dimension: 'x',
    as: 'percent',
  });

  const tooltipFormat = [
    'x*y',
    (x, y) => ({
      name: x,
      value: y,
    }),
  ];

  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(data.reduce((pre, now) => now.y + pre, 0).toFixed(2));
  }, [data]);

  const legendClickHandler = (item, i) => {
    const newItem = item;
    newItem.checked = !newItem.checked;
    const newLegendData = [...legendData];
    newLegendData[i] = newItem;
    const filteredLegendData = newLegendData.filter((l) => l.checked);

    const filteredLegendDataX = filteredLegendData.map((l) => l.x);
    if (chart) {
      chart.filter('x', (val) => filteredLegendDataX.indexOf(`${val}`) > -1);
    }
    setLegendData(newLegendData);

    setTotal(filteredLegendData.reduce((pre, now) => now.y + pre, 0).toFixed(2))

  };

  const [chart, setChart] = useState();
  const getG2Instance = (chart) => {
    setChart(chart);
  };
  useEffect(() => {
    getLegendData();
  }, [data, chart]);
  const [legendData, setLegendData] = useState([]);
  const getLegendData = () => {
    if (!chart) return;
    const geom = chart.geometries[0]; // 获取所有的图形
    if (!geom) return;
    const items = geom.dataArray || []; // 获取图形对应的
    const legendData = items.map((item) => {
      /* eslint no-underscore-dangle:0 */
      const origin = item[0]._origin;
      origin.color = item[0].color;
      origin.checked = true;
      return origin;
    });
    setLegendData(legendData);
  };

  const totalMessage = t('gross.amount');
  return (
    <Spin spinning={loading} size="large">
      <div className={styles['pie']}>
        {data && data.length > 0 ? (
          <>
            <Chart
              className={styles['chart']}
              height={400}
              data={dv}
              autoFit
              padding={[10, 40, 10, 40]}
              onGetG2Instance={getG2Instance}
            >
              <Legend visible={false} />
              <Coord type="theta" radius={0.7} innerRadius={0.65} />
              <Tooltip showTitle={false} />
              <Interval
                position="percent"
                adjust="stack"
                color="x"
                tooltip={tooltipFormat}
                style={{
                  lineWidth: 1,
                  stroke: '#fff',
                }}
                label={[
                  'count',
                  {
                    content: (data) => {
                      return `${data.x}: ${(data.percent * 100).toFixed(2)}%`;
                    },
                  },
                ]}
              />
              <Annotation.Text
                position={['50%', '40%']}
                content={totalMessage}
                style={{
                  fontSize: '16',
                  fill: '#8c8c8c',
                  textAlign: 'center',
                }}
              />
              <Annotation.Text
                position={['50%', '50%']}
                content={total}
                style={{
                  fontSize: '30',
                  fill: 'rgba(0,0,0,0.85)',
                  textAlign: 'center',
                }}
              />
            </Chart>
            <ul className={styles['legend']}>
              {legendData.map((item, i) => (
                <li key={item.x} onClick={() => legendClickHandler(item, i)}>
                  <span
                    className={styles.dot}
                    style={{ backgroundColor: !item.checked ? '#aaa' : item.color }}
                  />
                  <span className={styles.legendTitle}>{item.x}</span>
                  <Divider type="vertical" />
                  <span className={styles.percent}>{`${(Number.isNaN(item.percent)
                    ? 0
                    : item.percent * 100
                  ).toFixed(2)}%`}</span>
                  <span>&nbsp;</span>
                  <span className={styles.value}>{item.y}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Empty style={{ paddingTop: 50, width: '100%' }} />
        )}
      </div>
    </Spin>
  );
};
