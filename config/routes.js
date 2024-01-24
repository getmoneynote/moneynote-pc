/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './User/Register',
      },
    ],
  },
  {
    path: '/report',
    name: 'report',
    icon: 'PieChart',
    routes: [
      {
        path: '/report',
        redirect: '/report/dashboard',
      },
      {
        name: 'dashboard',
        path: '/report/dashboard',
        component: './reports/Dashboard',
      },
      {
        name: 'expense.category',
        path: '/report/expense-category',
        component: './reports/ExpenseCategory',
      },
      {
        name: 'expense.tag',
        path: '/report/expense-tag',
        component: './reports/ExpenseTag',
      },
      {
        name: 'expense.payee',
        path: '/report/expense-payee',
        component: './reports/ExpensePayee',
      },
      {
        name: 'income.category',
        path: '/report/income-category',
        component: './reports/IncomeCategory',
      },
      {
        name: 'income.tag',
        path: '/report/income-tag',
        component: './reports/IncomeTag',
      },
      {
        name: 'income.payee',
        path: '/report/income-payee',
        component: './reports/IncomePayee',
      },
    ],
  },
  {
    path: '/accounts',
    name: 'accounts',
    icon: 'bank',
    component: './Account',
  },
  {
    path: '/statement',
    name: 'statement',
    icon: 'container',
    component: './BalanceFlow',
  },
  {
    path: '/categories',
    name: 'categories',
    icon: 'apartment',
    hideInMenu: false,
    component: './Category',
  },
  {
    path: '/books',
    name: 'books',
    icon: 'folder',
    component: './Book',
  },
  {
    path: '/groups',
    name: 'groups',
    icon: 'team',
    component: './Group',
  },
  {
    path: '/book-templates',
    name: 'bookTemplates',
    icon: 'copy',
    component: './BookTemplates',
  },
  {
    path: '/note-days',
    name: 'noteDays',
    component: './NoteDay',
    icon: 'book',
  },
  {
    path: '/trash',
    name: 'trash',
    component: './Trash',
    icon: 'delete',
  },
  {
    path: '/',
    redirect: '/statement',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
  {
    path: '/test',
    layout: false,
    component: './Test',
  },
];
