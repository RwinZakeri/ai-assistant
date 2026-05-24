'use client';

import { DashboardUploadIcon } from '@/assets/images/svg/DashboardUpload';
import { DocIcon } from '@/assets/images/svg/Doc';
import { RedTrash01Icon } from '@/assets/images/svg/RedTrash01';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BinaryToMb from '@/utils/binaryToMb';
import { useRef } from 'react';

interface FineTuningFile {
  id: string;
  file: File;
  fileName: string;
  uploadDate: Date;
}

interface FineTuningUploadWithPreviewProps {
  files?: FineTuningFile[];
  onChange: (files: FineTuningFile[]) => void;
  error?: string;
  className?: string;
}

const FineTuningUploadWithPreview = ({
  files = [],
  onChange,
  error,
  className,
}: FineTuningUploadWithPreviewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) {
      const validFiles = newFiles.filter(
        file =>
          file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'application/pdf' ||
          file.name.endsWith('.docx') ||
          file.name.endsWith('.pdf'),
      );

      if (validFiles.length === 0) {
        return;
      }

      const newFineTuningFiles: FineTuningFile[] = validFiles.map(file => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        fileName: file.name,
        uploadDate: new Date(),
      }));

      onChange([...files, ...newFineTuningFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => {
    onChange(files.filter(file => file.id !== id));
  };

  const hasFiles = files.length > 0;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <input
        ref={fileInputRef}
        multiple
        accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
        className="sr-only"
        type="file"
        onChange={handleFileSelect}
      />

      <div
        className={cn(
          'flex min-h-[200px] w-full items-center justify-center p-6 rounded-2xl border-2 border-dashed bg-surfaceSecondary/40 text-sm text-textSecondary gap-6 transition-colors',
          error ? 'border-destructive' : 'border-linePrimary',
        )}
      >
        <div
          className={cn('cursor-pointer flex  gap-4')}
          onClick={() => fileInputRef.current?.click()}
        >
          <div>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surfaceSecondary">
              <DashboardUploadIcon />
            </span>
          </div>
          <div className="flex flex-col gap-2 items-start justify-center">
            <p className="text-lg-bold text-gray-25">
              {hasFiles ? 'افزودن فایل فاین تیون' : 'آپلود فایل فاین تیون'}
            </p>
            <p className="text-textSecondary">(DOCX, PDF - حداکثر ۵ مگابایت)</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col gap-3">
            {files.map(file => (
              <div
                key={file.id}
                className="flex items-center w-fit justify-between p-4 rounded-xl bg-surfaceSecondary"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary-700" />
                    <div className="absolute inset-[2px] rounded-full bg-primar-700" />
                    <div className="relative z-10">
                      <DocIcon />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {file.fileName.length > 25
                        ? `${file.fileName.substring(0, 25)}...`
                        : file.fileName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {BinaryToMb(file.file.size)} Mb
                    </p>
                  </div>
                </div>
                <Button
                  className="text-error-500 hover:text-error-400 flex-shrink-0"
                  size="sm"
                  type="button"
                  variant="link"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(file.id);
                  }}
                >
                  <RedTrash01Icon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FineTuningUploadWithPreview;
