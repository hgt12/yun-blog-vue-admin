import request from "@/utils/request";
import type { BlogCategoryQueryParams, BlogCategoryItem, BlogCategoryForm, OptionItem } from "@/types/api";

const BASE_URL = "/api/v1/blog/categories";

const BlogCategoryAPI = {
  getPage(queryParams: BlogCategoryQueryParams) {
    return request<any, PageResult<BlogCategoryItem>>({ url: BASE_URL, method: "get", params: queryParams });
  },
  getOptions() {
    return request<any, OptionItem[]>({ url: `${BASE_URL}/options`, method: "get" });
  },
  getFormData(id: string) {
    return request<any, BlogCategoryForm>({ url: `${BASE_URL}/${id}/form`, method: "get" });
  },
  create(data: BlogCategoryForm) {
    return request({ url: BASE_URL, method: "post", data });
  },
  update(id: string, data: BlogCategoryForm) {
    return request({ url: `${BASE_URL}/${id}`, method: "put", data });
  },
  deleteByIds(ids: string) {
    return request({ url: `${BASE_URL}/${ids}`, method: "delete" });
  },
};

export default BlogCategoryAPI;
