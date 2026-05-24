import { cn } from "@/lib/utils";
import downloadFile from "@/utils/downloadFile";
import getFileUrl from "@/utils/getFileUrl";
import Image from "next/image";
import { MessageDirection, type MessageProps } from "../../type";

const containerStyles: Record<MessageDirection, string> = {
  [MessageDirection.Send]: "pl-4 pr-6 bg-primary-500 rounded-br-none",
  [MessageDirection.Receive]: "rounded-bl-none pr-4 pl-6 bg-surfaceSecondary",
};

const wrapperStyles: Record<MessageDirection, string> = {
  [MessageDirection.Send]: "justify-start",
  [MessageDirection.Receive]: "justify-end",
};

const timerStyles: Record<MessageDirection, string> = {
  [MessageDirection.Send]: "text-primary-100",
  [MessageDirection.Receive]: "text-textSecondary",
};

const isImageFile = (url: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  return imageExtensions.some((ext) =>
    url.toLowerCase().includes(ext.toLowerCase())
  );
};

const Message = ({
  type,
  content,
  timestamp,
  attachmentUrls = [],
}: MessageProps) => {
  const fileUrls = attachmentUrls
    .map((url) => getFileUrl(url))
    .filter((url): url is string => url !== undefined);

  return (
    <div className={cn("w-full flex", wrapperStyles[type])}>
      <div
        className={cn(
          "py-5 rounded-lg max-w-[800px] flex flex-col gap-3",
          containerStyles[type]
        )}
      >
        {fileUrls.length > 0 && (
          <div className="flex flex-col gap-2">
            {fileUrls.map((url, index) => {
              if (isImageFile(url)) {
                return (
                  <div
                    key={index}
                    className="relative w-full max-w-md rounded-lg overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      width={400}
                      height={300}
                      className="object-contain w-full h-auto"
                      unoptimized
                    />
                  </div>
                );
              } else {
                return (
                  <button
                    key={index}
                    onClick={() => downloadFile(url)}
                    className="text-primary-300 hover:text-primary-400 underline text-sm text-left"
                  >
                    دانلود فایل {index + 1}
                  </button>
                );
              }
            })}
          </div>
        )}
        <div className="flex items-end gap-2">
          <div>
            <p className={cn(timerStyles[type], "text-xs")}>{timestamp}</p>
          </div>
          {content && (
            <div>
              <p className="text-textTertiary text-right whitespace-pre-wrap break-words">
                {content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
