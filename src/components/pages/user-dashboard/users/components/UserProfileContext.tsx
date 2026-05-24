"use client";

import { createContext, useContext, ReactNode } from "react";

interface UserProfileContextType {
  userId: string;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined
);

export const UserProfileProvider = ({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) => {
  return (
    <UserProfileContext.Provider value={{ userId }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
