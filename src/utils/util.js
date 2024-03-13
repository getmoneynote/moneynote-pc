import moment from 'moment';
import { getLocale } from 'umi';
import t from '@/utils/i18n';

// https://stackoverflow.com/questions/21148419/efficiently-rename-re-map-javascript-json-object-keys-within-array-of-objects
export function renameKeyInJson(json, keys) {
  let dataStr = JSON.stringify(json);
  keys.forEach((e) => {
    dataStr = dataStr.replace(new RegExp(`"${e.oldKey}":`, 'g'), `"${e.newKey}":`);
  });
  return JSON.parse(dataStr);
}

export function renameKeyInJsonForSelect(json) {
  return renameKeyInJson(json, [
    { oldKey: 'name', newKey: 'label' },
    { oldKey: 'id', newKey: 'value' },
  ]);
}

export function tableSortFormat(sorter) {
  let orderDir = '';
  for (let key in sorter) {
    orderDir = key;
    if (sorter[key] === 'ascend') {
      orderDir += ',asc';
    } else if (sorter[key] === 'descend') {
      orderDir += ',desc';
    }
  }
  return orderDir;
}

// 1-今天 2-本周 3-本月 4-今年 5-去年 6-7天内 7-30天内 8-1年内
export function radioValueToTimeRange(value) {
  switch (value) {
    case 1:
      return [moment().startOf('day'), moment().endOf('day')];
    case 2:
      return [moment().startOf('week'), moment().endOf('week')];
    case 3:
      return [moment().startOf('month'), moment().endOf('month')];
    case 4:
      return [moment().startOf('year'), moment().endOf('year')];
    case 5:
      return [
        moment().subtract(1, 'years').startOf('year'),
        moment().subtract(1, 'years').endOf('year'),
      ];
    case 6:
      return [moment().subtract(7, 'days'), moment()];
    case 7:
      return [moment().subtract(30, 'days'), moment()];
    case 8:
      return [moment().subtract(1, 'years'), moment()];
  }
}

// https://www.cnblogs.com/xintangchn/p/13197207.html
export function isEqual(obj1, obj2){
  //其中一个为值类型或null
  // if(!isObject(obj1) || !isObject(obj2)){
  //   return obj1 === obj2;
  // }

  //判断是否两个参数是同一个变量
  if(obj1 === obj2){
    return true;
  }

  //判断keys数是否相等
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if(obj1Keys.length !== obj2Keys.length){
    return false;
  }

  //深度比较每一个key
  for(let key in obj1){
    if(!isEqual(obj1[key], obj2[key])){
      return false;
    }
  }

  return true;
}

export function translateAction(action) {
  switch (action) {
    case 1:
      return t('add');
    case 2:
      return t('update');
    case 3:
      return t('copy');
    case 4:
      return t('refund');
  }
}

export function translateFlowType(type) {
  switch (type) {
    case 'EXPENSE':
      return t('expense');
    case 'INCOME':
      return t('income');
    case 'TRANSFER':
      return t('transfer');
    case 'ADJUST':
      return t('adjust.balance');
  }
}

export function translateAccountType(type) {
  switch (type) {
    case 'CHECKING':
      return t('checking.account');
    case 'CREDIT':
      return t('credit.account');
    case 'ASSET':
      return t('asset.account');
    case 'DEBT':
      return t('debt.account');
  }
}

export function datePickerRanges() {
  return {
    [t('today')]: [moment().startOf('day'), moment().endOf('day')],
    [t('in.30.days')]: [moment().subtract(30, 'days'), moment()],
    [t('this.month')]: [moment().startOf('month'), moment().endOf('month')],
    [t('this.year')]: [moment().startOf('year'), moment().endOf('year')],
    [t('last.year')]: [moment().add(-1, 'years').startOf('year'), moment().add(-1, 'years').endOf('year')],
  }
}

export function timeZoneOffset() {
  return (new Date().getTimezoneOffset()/60) * (-1);
}

export function dateFormatStr1() {
  const locale = getLocale();
  if (locale === 'en-US') {
    return 'MM/DD/YYYY HH:mm';
  } else if (locale === 'zh-CN') {
    return 'YYYY-MM-DD HH:mm';
  }
  return 'MM/DD/YYYY HH:mm';
}

export function dateFormatStr2() {
  const locale = getLocale();
  if (locale === 'en-US') {
    return 'MM/DD/YYYY';
  } else if (locale === 'zh-CN') {
    return 'YYYY-MM-DD';
  }
  return 'MM/DD/YYYY';
}






















