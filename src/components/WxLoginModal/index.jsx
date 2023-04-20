import {useEffect, useState} from "react";
import {Modal, Spin} from "antd";
import {useModel} from "@umijs/max";

// https://segmentfault.com/a/1190000019025598
// https://cloud.tencent.com/developer/article/1500623
// https://blog.csdn.net/weixin_49628108/article/details/128285184
// 备忘录模式: 防止重复加载
const loadWeChatJs = (() => {
  let exists = false; // 打点
  const src = '//res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'; // 微信sdk网址

  return () => new Promise((resolve, reject) => {
    // 防止重复加载
    if(exists) return resolve(window.WxLogin);

    let script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.onerror = reject; // TODO: 失败时候, 可以移除script标签
    script.onload = () => {
      exists = true;
      resolve(window.WxLogin);
    };
    document.body.appendChild(script);
  });
})();


export default (props) => {

  const { visible, setVisible } = useModel('modal');
  const [loading, setLoading] = useState(true);

  // 微信默认配置
  const baseOption = {
    self_redirect: true, // true: 页内iframe跳转; false: 新标签页打开
    id: 'wx_login_container',
    appid: 'wxabcf67082755291f',
    scope: 'snsapi_login',
    redirect_uri: encodeURIComponent('http://jz1.jiukuaitech.com/api/v1/loginWechat/callback'),
    state: `${(new Date()).getTime()}`,
  };

  const loadQRCode = (option, intl = false, width, height) => {
    const _option = {...baseOption, ...option};

    return new Promise((resolve, reject) => {
      try {
        window.WxLogin(_option);
        const ele = document.getElementById(_option['id']);
        const iframe = ele.querySelector('iframe');
        iframe.width = width? width : '300';
        iframe.height = height? height : '420';
        // 处理国际化
        intl && (iframe.src = iframe.src + '&lang=en');
        resolve(true);
      } catch(error) {
        reject(error);
      }
    });
  };

  useEffect(async () => {
    const wxOption = { };

    await loadWeChatJs();
    await loadQRCode(wxOption);
    setLoading(false);

  }, []);

  return(
    <Modal
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Spin spinning={loading} tip="Loading..." size="large">
        <div id="wx_login_container" style={{textAlign: 'center', width: 472, height: 425}}></div>
      </Spin>
    </Modal>
  )

}
