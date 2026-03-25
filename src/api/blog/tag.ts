import request from "@/utils/request";
import type { BlogTagQueryParams, BlogTagItem, BlogTagForm, OptionItem } from "@/types/api";

const BASE_URL = "/blog/tags";

const BlogTagAPI = {
  getPage(queryParams: BlogTagQueryParams) {
    return request<any, PageResult<BlogTagItem>>({
      url: BASE_URL,
      method: "get",
      params: queryParams,
    });
  },
  getOptions() {
    return request<any, OptionItem[]>({ url: `${BASE_URL}/options`, method: "get" });
  },
  getFormData(id: string) {
    return request<any, BlogTagForm>({ url: `${BASE_URL}/${id}/form`, method: "get" });
  },
  create(data: BlogTagForm) {
    return request({ url: BASE_URL, method: "post", data });
  },
  update(id: string, data: BlogTagForm) {
    return request({ url: `${BASE_URL}/${id}`, method: "put", data });
  },
  deleteByIds(ids: string) {
    return request({ url: `${BASE_URL}/${ids}`, method: "delete" });
  },
};

export default BlogTagAPI;
