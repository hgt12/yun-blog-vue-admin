import request from "@/utils/request";
import type { FileItem, FileQueryParams } from "@/types/api";

const FileAPI = {
  /** 获取文件资源列表 */
  getList(queryParams: FileQueryParams) {
    return request<any, { rows: FileItem[]; total: number }>({
      url: "/files",
      method: "get",
      params: queryParams,
    });
  },

  /** 上传通用文件（传入 FormData，上传进度回调） */
  upload(formData: FormData, onProgress?: (percent: number) => void) {
    return request<any, string>({
      url: "/files",
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
    });
  },

  /** 上传图片（传入 File） */
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    return request<any, string>({
      url: "/files/image",
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** 删除文件 */
  deleteByIds(ids: string) {
    return request({
      url: `/files/${ids}`,
      method: "delete",
    });
  },

  /** 下载文件 */
  download(url: string, fileName?: string) {
    return request({
      url,
      method: "get",
      responseType: "blob",
    }).then((res) => {
      const blob = new Blob([res.data]);
      const a = document.createElement("a");
      const urlObject = window.URL.createObjectURL(blob);
      a.href = urlObject;
      a.download = fileName || "下载文件";
      a.click();
      window.URL.revokeObjectURL(urlObject);
    });
  },
};

export default FileAPI;
