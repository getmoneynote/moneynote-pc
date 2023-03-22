import { useIntl } from '@umijs/max';

export default (id, args) => {
  const intl = useIntl();
  // setLocale('en-US', true);
  // setLocale('zh-CN', true);
  return intl.formatMessage({ id : id }, {...args});
}
