import { getToken } from '@/utils/cookies';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const headers: HeadersInit = {
    'tenant.id': '1',
    'aspnetcore.culture': 'fa',
    'accept-language': 'fa',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('https://assist.isnode.ir/File/upload', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const fileId =
    result?.result?.fileToken ||
    result?.result?.fileId ||
    result?.result?.id ||
    result?.fileToken ||
    result?.fileId ||
    result?.id ||
    result?.result ||
    result;

  if (!fileId || typeof fileId !== 'string') {
    console.error('Upload response:', result);
    throw new Error('Invalid file ID received from upload endpoint');
  }

  return fileId;
};

export const extractFileId = (imageString: string): string => {
  if (
    imageString.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  ) {
    return imageString;
  }
  if (imageString.startsWith('File/')) {
    return imageString;
  }
  if (imageString.includes('/File/DownloadBinaryFile?id=')) {
    const fileIdMatch = imageString.match(/[?&]id=([^&]+)/);
    return fileIdMatch && fileIdMatch[1]
      ? decodeURIComponent(fileIdMatch[1])
      : imageString;
  }
  if (imageString.includes('id=')) {
    const fileIdMatch = imageString.match(/[?&]id=([^&]+)/);
    return fileIdMatch && fileIdMatch[1]
      ? decodeURIComponent(fileIdMatch[1])
      : imageString;
  }
  return imageString;
};
