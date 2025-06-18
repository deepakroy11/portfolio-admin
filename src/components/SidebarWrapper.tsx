"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Link,
} from "@heroui/react";
import { BsSun, BsMoon } from "react-icons/bs";
import SideNavbar from "./SideNavbar";
import { usePageCheck } from "@/hooks/usePageCheck";
import { useSession, signOut } from "next-auth/react";

const SidebarWrapper = () => {
  const pathname = usePageCheck();
  const { data: session } = useSession();

  if (pathname == "/login") {
    return null; // Don't render sidebar on login page
  }

  return (
    <aside className="w-64 shadow-xl rounded m-4 dark:bg-primary-50 dark:shadow-gray-500 p-6">
      {/* Admin Panel Title */}

      <div className="flex items-center justify-between text-2xl font-bold">
        <span>Admin Panel</span>
        <Link href="#">
          <BsMoon className="w-5 h-5 inline-flex" />
        </Link>
      </div>

      {/* User Menu */}
      {session && (
        <div className="my-4 px-1 py-2 max-h-52 shadow rounded-xl border-slate-200 border-1">
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
      )}

      {/* Navigation Menu */}
      <SideNavbar />
    </aside>
  );
};

export default SidebarWrapper;
