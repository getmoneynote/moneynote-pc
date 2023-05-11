import type { IApi } from 'umi';

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $('head').append([
      `<link href="/favicon.ico" rel="shortcut icon">`,
    ])
    return $;
  });
};
