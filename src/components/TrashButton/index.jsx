import {Tooltip, Button} from "antd";
import t from "@/utils/i18n";

export default ({ onClick }) => {

  return (
    <Tooltip title={t('trash.tooltip')}>
      <Button type="link" onClick={onClick}>
        {t('trash')}
      </Button>
    </Tooltip>
  )

}
