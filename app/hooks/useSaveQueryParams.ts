"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export interface SaveQueryParams {
  initParamsObj: object;
  saveQueryParams: (name: string, value: any) => void;
  bulkSaveQueryParams: (values: {}) => void;
}
export default function useSaveQueryParams(key: any): SaveQueryParams {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // This variable contains persisted page's filtering values
  // and will only be loaded when the page loads for the first time
  const initParamsObj: object = useMemo(() => {
    const persisted =
      typeof window !== "undefined" ? localStorage.getItem(key) || "" : "";
    return new URLSearchParams(persisted)
      .toString()
      .replaceAll("+", " ")
      .split("&")
      .reduce((o, k: string) => {
        const split = k.split("=");
        const key = split[0];
        const value = split[1];
        return {
          ...o,
          [key]: value?.includes("%2C") ? value.split("%2C") : value,
        };
      }, {});
  }, []);

  const saveQueryParams = (name: string, value: any) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!value) {
      current.delete(name);
    } else {
      current.set(name, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    localStorage.setItem(key, query);
    router.push(`${pathname}${query}`);
  };

  const bulkSaveQueryParams = (values: object = {}) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.keys(values).forEach((key) => {
      if (!values[key]) {
        current.delete(key);
      } else {
        current.set(key, values[key]);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    localStorage.setItem(key, query);
    router.push(`${pathname}${query}`);
  };

  return { initParamsObj, saveQueryParams, bulkSaveQueryParams };
}
