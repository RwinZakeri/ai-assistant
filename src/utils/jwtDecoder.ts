import { decodeJwt } from 'jose';
import { getToken } from './cookies';

export const decodeJWT = (token: string) => {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  return decodeJWT(token);
};

export const getPermissionsFromToken = (token: string): string[] => {
  if (!token) {
    return [];
  }

  try {
    const decoded = decodeJWT(token);

    const permissions = decoded?.AdminClaims;

    if (!permissions) {
      return [];
    }

    return permissions as string[];
  } catch (error) {
    return [];
  }
};
