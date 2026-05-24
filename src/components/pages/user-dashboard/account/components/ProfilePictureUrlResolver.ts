import { useMemo } from "react";
import getFileUrl from "@/utils/getFileUrl";
import profileGroup from "@/assets/images/Proiflegroup.png";
import type { GetCurrentAppUserProfilePictureOutput } from "@/apis/models/GetCurrentAppUserProfilePictureOutput";

/**
 * Utility function to resolve profile picture URL from API response
 * Handles base64 strings, data URLs, and regular file URLs
 */
export const useProfilePictureUrl = (
  profilePictureData: GetCurrentAppUserProfilePictureOutput | undefined
) => {
  return useMemo(() => {
    if (profilePictureData?.profilePicture) {
      const pictureData = profilePictureData.profilePicture;

      if (typeof pictureData === "string") {
        // Check if it's already a data URL
        if (pictureData.startsWith("data:image/")) {
          return pictureData;
        }

        // Check if it's a base64 string (without data URL prefix)
        // Base64 strings are typically long and contain only base64 characters
        const isBase64 =
          pictureData.length > 50 &&
          /^[A-Za-z0-9+/=]+$/.test(pictureData) &&
          !pictureData.startsWith("http");

        if (isBase64) {
          // Detect image MIME type from base64 signature
          let mimeType = "image/jpeg"; // default
          if (
            pictureData.startsWith("iVBORw0KGgo") ||
            pictureData.startsWith("iVBOR")
          ) {
            mimeType = "image/png";
          } else if (
            pictureData.startsWith("/9j/") ||
            pictureData.startsWith("/9j")
          ) {
            mimeType = "image/jpeg";
          } else if (
            pictureData.startsWith("UklGR") ||
            pictureData.startsWith("UklG")
          ) {
            mimeType = "image/webp";
          } else if (pictureData.startsWith("R0lGOD")) {
            mimeType = "image/gif";
          }
          return `data:${mimeType};base64,${pictureData}`;
        }

        // If it's a URL, use getFileUrl
        const url = getFileUrl(pictureData);
        if (url) {
          return url;
        }
      }
    }
    return profileGroup;
  }, [profilePictureData]);
};

