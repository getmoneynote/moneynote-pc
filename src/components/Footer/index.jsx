import {Divider, Space, Button} from 'antd';
import ModalContainer from "@/components/ModalContainer";
import t from '@/utils/i18n';
import styles from './index.less';

export default () => {
  return (
    <Space className={styles['footer']} direction="vertical" size="small" style={{ width:"100%" }}>
      <div className={styles['footer-link']}>
        <a href="https://docs.jz.jiukuaitech.com/%E4%B8%8B%E8%BD%BD%E5%AE%A2%E6%88%B7%E7%AB%AF.html">{t('footer.download.app')}</a>
        <Divider type="vertical" />
        <a href="https://docs.jz.jiukuaitech.com">{t('footer.help.doc')}</a>
        <Divider type="vertical" />
        <a href="http://m.jz.jiukuaitech.com">{t('footer.mobile.site')}</a>
        <Divider type="vertical" />
        <a href="mailto:markliu2013@gmail.com">{t('footer.contact')}</a>
      </div>
      <div>
        &copy; {new Date().getFullYear()} {t('company.name')}
        <Divider type="vertical" />
        <a target="_blank" href="https://beian.miit.gov.cn/" rel="noreferrer">{t('footer.no')}</a>
        <Divider type="vertical" />
        v1.0.12
      </div>
      <ModalContainer />
    </Space>
  );
};
