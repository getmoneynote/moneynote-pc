import { Space } from 'antd';
import ModalContainer from "@/components/ModalContainer";
import t from '@/utils/i18n';

import styles from './index.less';

export default () => {
  return (
    <Space className={styles['footer']} direction="vertical" size="small" style={{ width:"100%" }}>
      {/*<div className={styles['footer-link']}>*/}
      {/*  <Space size="small">*/}
      {/*    <a href="#">{t('footer.download.ios')}</a>*/}
      {/*    <a href="#">{t('footer.download.andriod')}</a>*/}
      {/*    <a href="#">{t('footer.download.weibo')}</a>*/}
      {/*    <a href="#">{t('footer.download.zhihu')}</a>*/}
      {/*    <a href="#">{t('footer.download.contact')}</a>*/}
      {/*    <a href="#">{t('footer.download.about')}</a>*/}
      {/*  </Space>*/}
      {/*</div>*/}
      <div>&copy; {new Date().getFullYear()} {t('company.name')}{t('copyright.reserve')}&nbsp;&nbsp;<a target="_blank" href="https://beian.miit.gov.cn/">{t('footer.no')}</a> v1.0.11</div>
      <ModalContainer />
    </Space>
  );
};
