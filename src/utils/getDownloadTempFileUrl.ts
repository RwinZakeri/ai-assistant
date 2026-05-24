import type { FileDto } from '@/apis';
import downloadFile from './downloadFile';

const DEFAULT_DOWNLOAD_BASE_URL =
  'https://assist.isnode.ir/File/DownloadTempFile';
const DEFAULT_EXCEL_FILE_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * Constructs a temporary file download URL from FileDto
 * @param fileDto - File information including fileToken, fileName, and fileType
 * @param baseUrl - Base URL for download (optional)
 * @returns Complete URL for file download
 */
export const getDownloadTempFileUrl = (
  fileDto: FileDto,
  baseUrl: string = DEFAULT_DOWNLOAD_BASE_URL,
): string => {
  const { fileToken, fileName, fileType } = fileDto;

  if (!fileToken) {
    throw new Error('File token is required');
  }

  const params = new URLSearchParams({
    fileToken,
    fileName: fileName || 'download.xlsx',
    fileType: fileType || DEFAULT_EXCEL_FILE_TYPE,
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Downloads a file from FileDto
 * @param fileDto - File information including fileToken, fileName, and fileType
 * @param baseUrl - Base URL for download (optional)
 */
export const downloadFileFromDto = async (
  fileDto: FileDto,
  baseUrl?: string,
): Promise<void> => {
  const downloadUrl = getDownloadTempFileUrl(fileDto, baseUrl);
  downloadFile(downloadUrl, fileDto.fileName || 'download.xlsx');
};
