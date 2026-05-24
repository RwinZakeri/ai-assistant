import type { UploadedDoc } from '@/components/pages/user-dashboard/voice-assistants/type';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export const useDocumentHandling = () => {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [docCurrentPage, setDocCurrentPage] = useState(1);
  const [docPageSize, setDocPageSize] = useState(10);

  const handleDocUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const validFiles = Array.from(files).filter(
      file =>
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/pdf' ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.pdf'),
    );

    if (validFiles.length === 0) {
      toast.error('لطفاً فقط فایل‌های DOCX یا PDF را آپلود کنید');
      return;
    }

    const newDocs: UploadedDoc[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      fileName: file.name,
      uploadDate: new Date(),
    }));

    setUploadedDocs(prev => [...prev, ...newDocs]);
    toast.success(`${validFiles.length} فایل با موفقیت اضافه شد`);
    event.target.value = '';
  };

  const handleDeleteDoc = (id: string) => {
    setUploadedDocs(prev => {
      const updated = prev.filter(doc => doc.id !== id);
      const totalPages = Math.ceil(updated.length / docPageSize);
      if (docCurrentPage > totalPages && totalPages > 0) {
        setDocCurrentPage(totalPages);
      } else if (totalPages === 0) {
        setDocCurrentPage(1);
      }
      return updated;
    });
    toast.success('فایل با موفقیت حذف شد');
  };

  const { docTotalPages, docStartIndex, paginatedDocs } = useMemo(() => {
    const totalPages = Math.ceil(uploadedDocs.length / docPageSize);
    const startIndex = (docCurrentPage - 1) * docPageSize;
    const endIndex = startIndex + docPageSize;
    const paginated = uploadedDocs.slice(startIndex, endIndex);

    return {
      docTotalPages: totalPages,
      docStartIndex: startIndex,
      paginatedDocs: paginated,
    };
  }, [uploadedDocs, docCurrentPage, docPageSize]);

  return {
    uploadedDocs,
    setUploadedDocs,
    docCurrentPage,
    docPageSize,
    setDocCurrentPage,
    setDocPageSize,
    docTotalPages,
    docStartIndex,
    paginatedDocs,
    handleDocUpload,
    handleDeleteDoc,
  };
};
