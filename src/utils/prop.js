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
    showSizeChanger: true,
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
  labelInValue: true,
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
    labelInValue: true,//只能是true
    treeCheckStrictly: true,
  }
}

export const selectSingleProp = {
  labelInValue: true, //设置为true，可以方便修改时禁用了的也可以显示
  showArrow: true,
  showSearch: true,
  allowClear: true,
}

export const selectMultipleProp = {
  ...selectSingleProp,
  ...{
    mode: 'multiple',
  }
}
