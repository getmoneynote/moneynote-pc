import { get } from "@/utils/http";

export async function queryBookTemplates(params) {
  const response = await get('book-templates', params);
  return response.data;
}
