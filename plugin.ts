import type { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $('head').append([
      `<link href="/favicon.ico" rel="shortcut icon">`,
    ])
    // 百度统计
    $('head').append([
      `<script>
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?c612aa29079f1e51c734eea7401c215c";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
      </script>`,
    ])
    return $;
  });
};
