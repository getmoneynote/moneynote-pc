import {Switch} from "antd";

export default ({ value, request, disabled = false, onSuccess }) => {

  const changeHandler = async () => {
    await request();
    onSuccess();
  }

  return (
    <Switch disabled={disabled} onChange={ changeHandler } checked={value} />
  )

}
