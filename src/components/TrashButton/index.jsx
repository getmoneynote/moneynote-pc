import {Tooltip, Button} from "antd";
import t from "@/utils/i18n";

export default ({ onClick, disabled = false }) => {

  return (
    <Tooltip title={t('trash.tooltip')}>
      <Button type="link" onClick={onClick} disabled={disabled}>
        {t('trash')}
      </Button>
    </Tooltip>
  )

}
