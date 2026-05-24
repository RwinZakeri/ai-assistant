export interface UploadFileProps {
  errors?: {
    attachment?: { message?: string } | string;
  };
  attachment?: File | null;
  changeHandler: (file: File | null) => void;
  className?: string;
  labelClassName?: string;
  id?: string;
  accept?: string;
  helperText?: string;
  label?: string;
}
