const getFileUrl = (fileId: string | null | undefined): string | undefined => {
  if (!fileId) return undefined;

  if (fileId.startsWith("http://") || fileId.startsWith("https://")) {
    return fileId;
  }

  if (
    fileId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  ) {
    return `${process.env.NEXT_PUBLIC_API_URL}/File/DownloadBinaryFile?id=${fileId}`;
  }

  if (fileId.startsWith("File/")) {
    return `${process.env.NEXT_PUBLIC_API_URL}/${fileId}`;
  }

  return fileId;
};

export const mapImagesToUrls = (images: string[]): string[] => {
  return images
    .map((image) => getFileUrl(image))
    .filter((url): url is string => url !== undefined);
};

export default getFileUrl;
