import { getToken } from '@/utils/cookies';

export const isValidGuid = (id: string | null | undefined): boolean => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  const trimmed = id.trim();
  if (trimmed.length === 0) {
    return false;
  }
  const guidPattern = /^[0-9a-fA-F-]{32,36}$/;
  return guidPattern.test(
    trimmed.replace(/-/g, '').length >= 32 ? trimmed : trimmed,
  );
};

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://assist.isnode.ir';
  const response = await fetch(`${apiUrl}/File/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorText: string;
    try {
      const errorJson = await response.json();
      errorText =
        errorJson?.error?.message ||
        errorJson?.message ||
        JSON.stringify(errorJson);
    } catch {
      errorText = await response.text();
    }
    throw new Error(`Upload failed: ${response.status} ${errorText}`);
  }

  let result: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      result = await response.json();
    } catch (error) {
      const textResponse = await response.text();
      console.error('Failed to parse JSON response:', textResponse);
      throw new Error(`Invalid JSON response from server: ${textResponse}`);
    }
  } else {
    const textResponse = await response.text();
    if (textResponse.trim()) {
      result = textResponse.trim();
    } else {
      throw new Error('Empty response from server');
    }
  }

  let fileId: string | null = null;

  if (typeof result === 'string') {
    fileId = result;
  } else if (result && typeof result === 'object') {
    fileId =
      result?.result?.fileToken ||
      result?.result?.fileId ||
      result?.result?.id ||
      result?.fileToken ||
      result?.fileId ||
      result?.id ||
      result?.data?.fileToken ||
      result?.data?.fileId ||
      result?.data?.id ||
      (typeof result?.result === 'string' ? result.result : null) ||
      (typeof result?.data === 'string' ? result.data : null);
  }

  if (!fileId || typeof fileId !== 'string' || fileId.trim().length === 0) {
    throw new Error(
      `File ID not found in upload response. Response: ${JSON.stringify(
        result,
      )}`,
    );
  }

  return fileId.trim();
};

export const scrollToFirstError = () => {
  const firstErrorField = document.querySelector('[role="alert"]');
  if (firstErrorField) {
    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const firstInvalidInput = document.querySelector(
    '[aria-invalid="true"]',
  ) as HTMLElement | null;
  if (firstInvalidInput) {
    firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstInvalidInput.focus();
  }
};
