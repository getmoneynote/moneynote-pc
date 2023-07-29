import {useState} from "react";
import {Button, Divider, Input} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ProFormSelect} from "@ant-design/pro-components";
import {useRequest} from "@umijs/max";
import {selectSingleProp} from "@/utils/prop";
import {queryAll, create} from "@/services/common";
import t from "@/utils/i18n";

export default (props) => {

  const { currentBook, tabKey, formRef } = props;

  const { data : payees = [], loading : payeesLoading, run : loadPayees} = useRequest(() => queryAll('payees', {
    'bookId': currentBook.id,
    'canExpense': tabKey === 'EXPENSE' ? true : null,
    'canIncome': tabKey === 'INCOME' ? true : null,
  }), { manual: true });

  const [addLoading, setAddLoading] = useState(false);
  const [nameValue, setNameValue] = useState();

  return(
    <ProFormSelect
      name="payee"
      label={t('flow.label.payee')}
      fieldProps={{
        ...selectSingleProp,
        onFocus: loadPayees,
        options: payees,
        loading: payeesLoading,
        dropdownRender: menu =>
          <>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: '4px 10px' }}>
              <Input style={{ flex: 'auto' }} value={nameValue} onChange={e => setNameValue(e.target.value)}  />
              <Button icon={<PlusOutlined />} type="link" loading={addLoading}
                onClick={async () => {
                  if (addLoading || !nameValue) return false;
                  setAddLoading(true);
                  try {
                    const response = await create('payees', {
                      bookId: currentBook.id,
                      name: nameValue,
                      canExpense: tabKey === 'EXPENSE',
                      canIncome: tabKey === 'INCOME',
                    });
                    await loadPayees();
                    formRef.current?.setFieldValue('payee', response.data);
                    // TODO 关闭下拉

                  } finally {
                    setAddLoading(false);
                    setNameValue(null);
                  }
                  // form.setFieldsValue({payeeId: response.data.id});
                }}
              >{t('add')}</Button>
            </div>
          </>
      }}
    />
  );

}
