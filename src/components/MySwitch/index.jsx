import {Switch} from "antd";

export default ({ value, request, disabled = false, onSuccess }) => {

  const changeHandler = async () => {
    const response = await request();
    if (response.success) onSuccess();
  }

  return (
    <Switch disabled={disabled} onChange={ changeHandler } checked={value} />
  )

}
