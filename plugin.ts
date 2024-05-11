import type { IApi } from 'umi';
import {prepend} from "@umijs/utils/compiled/cheerio/lib/api/manipulation";

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $('head').append([
      `<link href="/favicon.ico" rel="shortcut icon">`,
    ])
    // loading
    $('head').append([
      `<style>
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
          position: absolute;
          top: 50%;
          left: 50%;
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        }
        .loader {
          border: 16px solid #f3f3f3;
          border-radius: 50%;
          border-top: 16px solid blue;
          border-right: 16px solid green;
          border-bottom: 16px solid red;
          border-left: 16px solid pink;
          width: 120px;
          height: 120px;
          -webkit-animation: spin 2s linear infinite;
          animation: spin 2s linear infinite;
        }
        @-webkit-keyframes spin {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      </style>`,
    ]);
    $('body').prepend([
      `<div class="loading">
         <div class="loader"></div>
       </div>`
    ]);
    $('head').append([
      `<script>
        window.addEventListener("load", () => {
          let element = document.getElementsByClassName("loading");
          element[0].parentNode.removeChild(element[0]);
        });
      </script>`,
    ]);
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
