"use client";

import { usePathname } from "next/navigation";

export const usePageCheck = () => {
  const pathname = usePathname();
  return pathname === "/login";
};
