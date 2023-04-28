import { Button, Space } from 'antd';
import { QuestionCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { SelectLang, useModel } from '@umijs/max';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import t from "@/utils/i18n";

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'realDark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <Button type="link" icon={<DownloadOutlined />} href="https://docs.jz.jiukuaitech.com/%E4%B8%8B%E8%BD%BD%E5%AE%A2%E6%88%B7%E7%AB%AF.html" target="_blank">{t('footer.download.app')}</Button>
      <Button type="link" icon={<QuestionCircleOutlined />} href="https://docs.jz.jiukuaitech.com" target="_blank">{t('footer.help.doc')}</Button>
      <Avatar />
      <SelectLang className={styles.action} />
    </Space>
  );
};
export default GlobalHeaderRight;
