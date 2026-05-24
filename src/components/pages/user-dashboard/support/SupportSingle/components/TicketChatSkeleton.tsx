import { Skeleton } from "@/components/ui/skeleton";

interface TicketChatSkeletonProps {
  messageCount?: number;
}

const TicketChatSkeleton = ({ messageCount = 8 }: TicketChatSkeletonProps) => {
  return (
    <>
      <div className="h-[60px] px-8 right-0 z-50 w-full border-b border-gray-800/50 flex absolute items-center gap-2 bg-surfacePrimary">
        <Skeleton className="w-2.5 h-2.5 rounded-full opacity-40" />
        <Skeleton className="h-4 w-28 opacity-50" />
      </div>

      <div className="w-full h-[calc(100vh-131px)] pb-8 flex flex-col relative">
        <div className="flex-1 flex overflow-y-auto flex-col gap-6 pl-8 pb-8 pt-20">
          {Array.from({ length: messageCount }).map((_, index) => {
            const isSent = index % 2 === 0;
            const messageWidths = [42, 67];
            const line1Widths = [12];
            const line2Widths = [20, 14];
            const line3Widths = [12, 17];

            const randomWidth = messageWidths[index % messageWidths.length];
            const lineWidth1 = line1Widths[index % line1Widths.length];
            const lineWidth2 = line2Widths[index % line2Widths.length];
            const lineWidth3 = line3Widths[index % line3Widths.length];

            return (
              <div
                key={index}
                className={`w-full flex ${
                  isSent ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  style={{ width: `${randomWidth}%` }}
                  className={`py-3 px-4 rounded-lg flex flex-col gap-2 ${
                    isSent
                      ? "bg-primary-500 rounded-br-none"
                      : "rounded-bl-none bg-surfaceSecondary"
                  }`}
                >
                  <div className="flex items-end gap-2">
                    <Skeleton
                      className={`h-3 w-12 opacity-40 ${
                        isSent ? "bg-primary-100" : "bg-textSecondary"
                      }`}
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton
                        className={`h-4 w-full opacity-50 ${
                          isSent ? "bg-primary-100/50" : "bg-textTertiary/50"
                        }`}
                      />
                      <Skeleton
                        style={{ width: `${lineWidth1}%` }}
                        className={`h-4 opacity-40 ${
                          isSent ? "bg-primary-100/40" : "bg-textTertiary/40"
                        }`}
                      />
                      {index % 2 === 0 && (
                        <Skeleton
                          style={{ width: `${lineWidth2}%` }}
                          className={`h-4 opacity-35 ${
                            isSent ? "bg-primary-100/35" : "bg-textTertiary/35"
                          }`}
                        />
                      )}
                      {index % 3 === 0 && (
                        <Skeleton
                          style={{ width: `${lineWidth3}%` }}
                          className={`h-4 opacity-30 ${
                            isSent ? "bg-primary-100/30" : "bg-textTertiary/30"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full right-0 absolute bottom-0 left-0 pl-12 flex gap-2 items-start">
          <div className="sticky bottom-0 left-0 w-full">
            <div className="relative flex items-center">
              <Skeleton className="absolute right-3 w-5 h-5 rounded opacity-40" />
              <Skeleton className="w-full h-10 rounded-md pr-12 opacity-50" />
            </div>
          </div>
          <Skeleton className="h-10 w-10 shrink-0 rounded-md opacity-50" />
        </div>
      </div>
    </>
  );
};

export default TicketChatSkeleton;
