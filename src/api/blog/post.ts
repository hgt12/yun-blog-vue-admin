import request from "@/utils/request";
import type { BlogPostQueryParams, BlogPostItem, BlogPostForm } from "@/types/api";

const BASE_URL = "/api/v1/blog/posts";

const BlogPostAPI = {
  getPage(queryParams: BlogPostQueryParams) {
    return request<any, PageResult<BlogPostItem>>({ url: BASE_URL, method: "get", params: queryParams });
  },
  getFormData(id: string) {
    return request<any, BlogPostForm>({ url: `${BASE_URL}/${id}/form`, method: "get" });
  },
  create(data: BlogPostForm) {
    return request({ url: BASE_URL, method: "post", data });
  },
  update(id: string, data: BlogPostForm) {
    return request({ url: `${BASE_URL}/${id}`, method: "put", data });
  },
  deleteByIds(ids: string) {
    return request({ url: `${BASE_URL}/${ids}`, method: "delete" });
  },
};

export default BlogPostAPI;
