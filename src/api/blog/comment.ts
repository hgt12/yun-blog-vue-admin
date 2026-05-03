import request from "@/utils/request";
import type {
  BlogCommentQueryParams,
  BlogCommentItem,
  BlogCommentForm,
  BlogCommentStatistics,
} from "@/types/api";

const BASE_URL = "/comments";

const BlogCommentAPI = {
  getPage(queryParams: BlogCommentQueryParams) {
    return request<any, PageResult<BlogCommentItem>>({
      url: BASE_URL,
      method: "get",
      params: queryParams,
    });
  },

  create(data: BlogCommentForm) {
    return request({
      url: BASE_URL,
      method: "post",
      data,
    });
  },

  deleteByIds(ids: string) {
    return request<any, { msg: string }>({
      url: `${BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  approve(ids: string) {
    return request<any, { msg: string }>({
      url: `${BASE_URL}/${ids}/approve`,
      method: "put",
    });
  },

  reject(ids: string) {
    return request<any, { msg: string }>({
      url: `${BASE_URL}/${ids}/reject`,
      method: "put",
    });
  },

  getStatistics() {
    return request<any, BlogCommentStatistics>({
      url: `${BASE_URL}/statistics`,
      method: "get",
    });
  },

  export(queryParams: Partial<BlogCommentQueryParams>) {
    return request({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
      responseType: "blob",
    });
  },
};

export default BlogCommentAPI;
