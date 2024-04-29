import {Divider, Space} from 'antd';
import {useRequest} from "@umijs/max";
import ModalContainer from "@/components/ModalContainer";
import {apiVersion} from "@/services/common";
import styles from './index.less';
import packageJson from '/package.json';

export default () => {

  const { data: version } = useRequest(apiVersion);

  return (
    <Space className={styles['footer']} direction="vertical" size="small" style={{ width:"100%" }}>
      {/*<div className={styles['footer-link']}>*/}
      {/*  <a href="https://help.moneynote.com/app.html" target="_blank">{t('footer.download.app')}</a>*/}
      {/*  <Divider type="vertical" />*/}
      {/*  <a href="https://help.moneynote.com" target="_blank">{t('footer.help.doc')}</a>*/}
      {/*  <Divider type="vertical" />*/}
      {/*  <a href="https://space.bilibili.com/392661804/channel/seriesdetail?sid=3371573" target="_blank">B站视频</a>*/}
      {/*  <Divider type="vertical" />*/}
      {/*  <span>{t('footer.qq.group')}: 639653091</span>*/}
      {/*</div>*/}
      <div>
        &copy; {new Date().getFullYear()} <a href="https://www.moneynote.com" target="_blank">moneynote.com</a>
        <Divider type="vertical" />
        v{packageJson.version}
        <Divider type="vertical" />
        api-version: {version}
      </div>
      <ModalContainer />
    </Space>
  );
};
