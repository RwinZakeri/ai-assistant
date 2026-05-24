import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    return paramsObj;
  }, [searchParams]);

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const getAllParams = useCallback(
    (key: string): string[] => {
      return searchParams.getAll(key);
    },
    [searchParams]
  );

  const hasParam = useCallback(
    (key: string): boolean => {
      return searchParams.has(key);
    },
    [searchParams]
  );

  const createParams = useCallback(
    (
      updates?: Record<
        string,
        string | string[] | number | number[] | null | undefined
      >
    ) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (updates) {
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            newParams.delete(key);
          } else if (Array.isArray(value)) {
            newParams.delete(key);
            value.forEach((item) => {
              if (item !== null && item !== undefined) {
                newParams.append(key, String(item));
              }
            });
          } else {
            newParams.set(key, String(value));
          }
        });
      }

      return newParams;
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | number | null | undefined) => {
      const newParams = createParams({ [key]: value });
      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [createParams, router, pathname]
  );

  const setParams = useCallback(
    (
      updates: Record<
        string,
        string | string[] | number | number[] | null | undefined
      >
    ) => {
      const newParams = createParams(updates);
      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [createParams, router, pathname]
  );

  const deleteParam = useCallback(
    (key: string) => {
      const newParams = createParams({ [key]: null });
      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [createParams, router, pathname]
  );

  const deleteParams = useCallback(
    (keys: string[]) => {
      const updates: Record<string, null> = {};
      keys.forEach((key) => {
        updates[key] = null;
      });
      const newParams = createParams(updates);
      const queryString = newParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [createParams, router, pathname]
  );

  const clearParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const replaceParams = useCallback(
    (newParams: Record<string, string | string[] | number | number[]>) => {
      const params = new URLSearchParams();
      Object.entries(newParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            params.append(key, String(item));
          });
        } else {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, pathname]
  );

  return {
    params,

    getParam,
    getAllParams,
    hasParam,

    setParam,
    setParams,
    deleteParam,
    deleteParams,
    clearParams,
    replaceParams,
  };
}
