import {Divider, Space} from 'antd';
import ModalContainer from "@/components/ModalContainer";
import t from '@/utils/i18n';
import styles from './index.less';

export default () => {
  return (
    <Space className={styles['footer']} direction="vertical" size="small" style={{ width:"100%" }}>
      <div className={styles['footer-link']}>
        <a href="https://help.moneywhere.com/app.html" target="_blank">{t('footer.download.app')}</a>
        <Divider type="vertical" />
        <a href="https://help.moneywhere.com" target="_blank">{t('footer.help.doc')}</a>
        <Divider type="vertical" />
        <a href="https://space.bilibili.com/392661804/channel/seriesdetail?sid=3371573" target="_blank">B站视频</a>
        <Divider type="vertical" />
        <span>{t('footer.qq.group')}: 639653091</span>
      </div>
      <div>
        &copy; {new Date().getFullYear()} {t('company.name')}
        <Divider type="vertical" />
        <a target="_blank" href="https://beian.miit.gov.cn/" rel="noreferrer">{t('footer.no')}</a>
        <Divider type="vertical" />
        v1.0.18
      </div>
      <ModalContainer />
    </Space>
  );
};
