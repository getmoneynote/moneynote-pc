import {Modal} from "antd";
import {useModel} from "@umijs/max";

export default ({ title, footer, children }) => {

  const { visible, setVisible } = useModel('modal');

  return(
    <Modal
      title={title}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={footer}
    >
      {children}
    </Modal>
  )

}
