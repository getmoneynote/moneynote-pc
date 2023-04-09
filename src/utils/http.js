import { request as umiRequst } from "@umijs/max";

export const request = async (uri, params) => {
  try {
    return await umiRequst(uri, params);
  } catch (error) {
    // console.log(error);
  }
}
