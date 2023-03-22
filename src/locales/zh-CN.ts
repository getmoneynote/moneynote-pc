import account from './zh-CN/account';
import book from './zh-CN/book';
import category from './zh-CN/category';
import common from './zh-CN/common';
import flow from './zh-CN/flow';
import footer from './zh-CN/footer';
import menu from './zh-CN/menu';
import noteDay from './zh-CN/noteDay';
import pages from './zh-CN/pages';
import report from './zh-CN/report';
import settingDrawer from './zh-CN/settingDrawer';
import user from './zh-CN/user';

export default {
  ...pages,
  ...menu,
  ...settingDrawer,
  ...common,
  ...account,
  ...category,
  ...user,
  ...flow,
  ...book,
  ...noteDay,
  ...report,
  ...footer,
};
