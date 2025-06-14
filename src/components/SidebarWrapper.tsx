"use client";

import SideNavbar from "./SideNavbar";
import { usePageCheck } from "@/hooks/usePageCheck";

const SidebarWrapper = () => {
  const isLoginPage = usePageCheck();
  if (isLoginPage) {
    return null; // Don't render sidebar on login page
  }

  return (
    <aside className="w-64 shadow-md dark:bg-primary-50 dark:shadow-gray-500">
      <div className="p-6 text-2xl font-bold">Admin Panel</div>
      <SideNavbar />
    </aside>
  );
};

export default SidebarWrapper;
