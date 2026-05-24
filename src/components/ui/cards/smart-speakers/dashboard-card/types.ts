import type { ResponseSpeed as ResponseSpeedType } from "@/apis/models/ResponseSpeed";
import type { GetAssistantsLightWeightOutput } from "@/apis/models/GetAssistantsLightWeightOutput";
import type { ActiveAssistantDto } from "@/apis/models/ActiveAssistantDto";

export interface SmartSpeakerDashboardCardProps {
  id: number;
  thumbnail: string;
  title: string;
  responseSpeed?: ResponseSpeedType;
  activeAssistants?: GetAssistantsLightWeightOutput[];
  attachedAssistants?: ActiveAssistantDto[];
  onDelete?: (id: number) => void;
  onResponseSpeedChange?: (id: number, speed: ResponseSpeedType) => void;
  onAttachAssistant?: (speakerId: number, assistantId: number) => void;
  onDetachAssistant?: (speakerId: number, assistantId: number) => void;
}
