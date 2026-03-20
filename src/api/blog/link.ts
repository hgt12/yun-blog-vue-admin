import request from "@/utils/request";
import type { BlogLinkQueryParams, BlogLinkItem, BlogLinkForm } from "@/types/api";

const BASE_URL = "/api/v1/blog/links";

const BlogLinkAPI = {
  getPage(queryParams: BlogLinkQueryParams) {
    return request<any, PageResult<BlogLinkItem>>({ url: BASE_URL, method: "get", params: queryParams });
  },
  getFormData(id: string) {
    return request<any, BlogLinkForm>({ url: `${BASE_URL}/${id}/form`, method: "get" });
  },
  create(data: BlogLinkForm) {
    return request({ url: BASE_URL, method: "post", data });
  },
  update(id: string, data: BlogLinkForm) {
    return request({ url: `${BASE_URL}/${id}`, method: "put", data });
  },
  deleteByIds(ids: string) {
    return request({ url: `${BASE_URL}/${ids}`, method: "delete" });
  },
};

export default BlogLinkAPI;
