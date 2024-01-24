import {useRef,useEffect} from "react";
import { ModalForm } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';

export default (props) => {

  const {
    title,
    width = 600,
    labelWidth,
    initialValues = { },
    request,
    params,
    onSuccess,
    autoFocusFirstInput = false,
    isKeyPressSubmit = true,
    submitter = true,
    formRef = useRef()
  } = props;

  const { visible, setVisible } = useModel('modal');

  const finishHandler = async (values) => {
    await request({...values, ...params});
    formRef.current?.resetFields();
    if (onSuccess) onSuccess();
    return true;
  }

  useEffect(() => {
    // 加visible是为了每次打开都执行一次，清空前面的输入
    if (visible && initialValues && Object.keys(initialValues).length > 0) {
      // 把之前的输入清空，因为有些输入项没有被initialValues包含。
      formRef.current?.resetFields();
      formRef.current?.setFieldsValue({...initialValues});
    }
  }, [initialValues, visible]);

  return (
    <ModalForm
      width={width}
      layout="horizontal"
      grid={true}
      labelCol={{ style: { width: 'auto', minWidth: labelWidth } }}
      title={title}
      formRef={formRef}
      open={visible}
      onOpenChange={setVisible}
      onFinish={finishHandler}
      dateFormatter={value => value.valueOf()}
      modalProps={{ destroyOnClose: false, maskClosable: false }}
      autoFocusFirstInput={autoFocusFirstInput}
      isKeyPressSubmit={isKeyPressSubmit}
      submitter={submitter}
      // submitter={{
      //   render: (props, defaultDoms) => {
      //     return [
      //       ...defaultDoms,
      //       <Button onClick={() => { props.reset() }}>{t('reset')}</Button>,
      //     ];
      //   },
      // }}
    >
      {props.children}
    </ModalForm>
  );

}
