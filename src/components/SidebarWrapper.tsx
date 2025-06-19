"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Link,
  Tooltip,
} from "@heroui/react";
import { BsSun, BsMoon } from "react-icons/bs";
import SideNavbar from "./SideNavbar";
import { usePageCheck } from "@/hooks/usePageCheck";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";
import { useTheme } from "@/context/themeContext";

const SidebarWrapper = () => {
  const pathname = usePageCheck();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  if (pathname == "/login") {
    return null; // Don't render sidebar on login page
  }

  return (
    <aside className="w-64 shadow-xl rounded-xl border-primary-100 m-4  p-6 dark:shadow-primary-100">
      {/* Admin Panel Title */}

      <div className="flex items-center justify-between text-2xl font-bold">
        <span>Admin Panel</span>
        <Tooltip
          content={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <Link href="#" onPress={toggleTheme}>
            {theme === "light" ? (
              <BsMoon className="w-5 h-5 inline-flex" />
            ) : (
              <BsSun className="w-5 h-5 inline-flex" />
            )}
          </Link>
        </Tooltip>
      </div>

      {/* User Menu */}
      {session && (
        <Suspense fallback="Loading">
          <div className="my-4 px-1 py-2 max-h-52 shadow rounded-xl border-primary-100 border-1">
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar
                    name={session.user?.name || "User"}
                    src={session.user?.image || ""}
                    size="sm"
                  />
                  <span className="text-sm font-medium">
                    {session.user?.name}
                  </span>
                </div>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="profile">Profile</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => signOut()}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Suspense>
      )}

      {/* Navigation Menu */}
      <SideNavbar />
    </aside>
  );
};

export default SidebarWrapper;
