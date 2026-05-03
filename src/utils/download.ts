/**
 * 文件下载工具函数
 */

/**
 * 从响应头中提取文件名
 * @param contentDisposition Content-Disposition 响应头
 * @returns 解码后的文件名
 */
function extractFileName(contentDisposition: string): string {
  if (!contentDisposition) {
    return `download_${Date.now()}`;
  }

  // 尝试从 filename*=UTF-8'' 格式中提取（RFC 5987）
  const filenameStarRegex = /filename\*=UTF-8''(.+?)(?:;|$)/i;
  const starMatches = filenameStarRegex.exec(contentDisposition);
  if (starMatches && starMatches[1]) {
    return decodeURIComponent(starMatches[1]);
  }

  // 尝试从 filename= 格式中提取
  const filenameRegex = /filename=([^;]+)/i;
  const matches = filenameRegex.exec(contentDisposition);
  if (matches && matches[1]) {
    let filename = matches[1].trim().replace(/^["']|["']$/g, "");

    // 如果文件名包含 URL 编码的字符（如 %E8），进行解码
    if (filename.includes("%")) {
      try {
        filename = decodeURIComponent(filename);
      } catch (e) {
        // 如果解码失败，尝试使用 decodeURI
        try {
          filename = decodeURI(filename);
        } catch (e2) {
          // 解码失败，使用原始文件名
          console.warn("文件名解码失败:", filename);
        }
      }
    }

    return filename;
  }

  return `download_${Date.now()}`;
}

/**
 * 下载文件
 * @param response Axios 响应对象
 * @param customFileName 自定义文件名（可选）
 *
 * @example
 * ```ts
 * // 基础用法
 * const response = await UserAPI.export(queryParams);
 * downloadFile(response);
 *
 * // 自定义文件名
 * downloadFile(response, "用户列表.xlsx");
 * ```
 */
export function downloadFile(response: any, customFileName?: string): void {
  try {
    const fileData = response.data;
    const contentDisposition = response.headers["content-disposition"];
    const contentType = response.headers["content-type"] || "application/octet-stream";

    const fileName = customFileName || extractFileName(contentDisposition);

    // 创建 Blob 对象，指定正确的 MIME 类型
    const blob = new Blob([fileData], { type: contentType });

    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("文件下载失败:", error);
    throw error;
  }
}
