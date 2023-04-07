import { TreeSelect } from 'antd';

export const tableProp = {
  bordered: true,
  rowKey: 'id',
  showSorterTooltip: false,
  search: {
    defaultCollapsed: true,
  },
  pagination: {
    defaultPageSize: 10,
  },
  scroll: {
    x: 'max-content',
  },
  // 搜索表单的日期变成时间戳
  dateFormatter: (value) => value.valueOf(),
  //sortDirections: ['asc', 'desc']
};

export const spaceVProp = {
  direction: 'vertical',
  size: 'small',
  style: { width: '100%' },
};

export const treeSelectSingleProp = {
  treeDataSimpleMode: false,
  multiple: false,
  allowClear: true,
  treeCheckable: false,
  showArrow: true,
  showSearch: true,
  filterTreeNode: true,
  treeNodeFilterProp: 'label',
  labelInValue: false,
  treeCheckStrictly: false,
  fieldNames: {
    label: 'label',
  },
  dropdownMatchSelectWidth: false,
  showCheckedStrategy: TreeSelect.SHOW_ALL,
};

export const treeSelectMultipleProp = {
  ...treeSelectSingleProp,
  ...{
    multiple: true,
    treeCheckable: true,
    treeCheckStrictly: true,
  }
}

export const selectSearchProp = {
  showArrow: true,
  showSearch: true,
  allowClear: true,
  mode: 'multiple',
};
