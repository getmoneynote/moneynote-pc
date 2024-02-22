import account from './en-US/account';
import book from './en-US/book';
import group from './en-US/group';
import category from './en-US/category';
import common from './en-US/common';
import flow from './en-US/flow';
import footer from './en-US/footer';
import menu from './en-US/menu';
import noteDay from './en-US/noteDay';
import report from './en-US/report';
import user from './en-US/user';

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
