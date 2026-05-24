import type { NextApiRequestCookies } from "next/dist/server/api-utils";

export const parseCookie = (str: string): { [name: string]: string } => {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc: { [name: string]: string }, v) => {
      if (v.length > 1) {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());

        return acc;
      } else {
        return {};
      }
    }, {});
};

export const setToken = (accessToken: string, setExpiry = false): void => {
  if (typeof window !== "undefined") {
    let cookieString = `accessToken=${accessToken}; path=/;`;

    if (setExpiry) {
      const now = new Date();
      const time = now.getTime();
      const expireTime = time + 2592000000;
      now.setTime(expireTime);
      cookieString += ` expires=${now.toUTCString()};`;
    }

    document.cookie = cookieString;
  }
};

export const setRefreshToken = (token: string, setExpiry = false): void => {
  if (typeof window !== "undefined") {
    let cookieString = `refreshToken=${token}; path=/;`;

    if (setExpiry) {
      const now = new Date();
      const time = now.getTime();
      const expireTime = time + 2592000; // 30 day

      now.setTime(expireTime);
      cookieString += ` expires=${now.toUTCString()};`;
    }

    document.cookie = cookieString;
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

export const removeRefreshToken = (): void => {
  if (typeof window !== "undefined") {
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
};

export const getToken = (cookies?: NextApiRequestCookies): string | null => {
  if (cookies) {
    if (cookies.accessToken) {
      return cookies.accessToken;
    }

    return null;
  }

  if (typeof window !== "undefined") {
    const cookie = parseCookie(document.cookie);

    if (cookie.accessToken) {
      return cookie.accessToken;
    }
  }

  return null;
};

export const getCookieInCSR = (cookieName: string) => {
  const cookies = document.cookie;
  const cookieArray = cookies.split("; ");

  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i];
    const [name, value] = cookie.split("=");

    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    const cookie = parseCookie(document.cookie);

    return cookie.refreshToken;
  }

  return null;
};

export const setCoockie = (
  name: string,
  value: boolean,
  setExpiry = false
): void => {
  let cookieString = `${name}=${value}; path=/;`;

  if (setExpiry) {
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 2592000; // 30 day

    now.setTime(expireTime);
    cookieString += ` expires=${now.toUTCString()};`;
  }

  document.cookie = cookieString;
};
