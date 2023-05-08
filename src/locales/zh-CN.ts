import account from './zh-CN/account';
import book from './zh-CN/book';
import group from './zh-CN/group';
import category from './zh-CN/category';
import common from './zh-CN/common';
import flow from './zh-CN/flow';
import footer from './zh-CN/footer';
import menu from './zh-CN/menu';
import noteDay from './zh-CN/noteDay';
import report from './zh-CN/report';
import user from './zh-CN/user';

export default {
  ...menu,
  ...common,
  ...account,
  ...category,
  ...user,
  ...flow,
  ...book,
  ...group,
  ...noteDay,
  ...report,
  ...footer,
};
