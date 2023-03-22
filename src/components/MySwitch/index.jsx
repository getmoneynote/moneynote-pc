import {Switch} from "antd";

export default ({ value, request, disabled = false, onSuccess }) => {

  const changeHandler = () => {
    request();
    onSuccess();
  }

  return (
    <Switch disabled={disabled} onChange={ changeHandler } checked={value} />
  )

}
