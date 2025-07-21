"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@heroui/react";
import { BsSun, BsMoon, BsBoxArrowRight } from "react-icons/bs";
import SideNavbar from "./SideNavbar";
import { usePageCheck } from "@/hooks/usePageCheck";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/context/themeContext";

const SidebarWrapper = () => {
  const pathname = usePageCheck();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  if (pathname === "/login") {
    return null;
  }

  return (
    <aside className="w-64 h-screen border border-primary-50 flex m-4 shadow rounded-2xl flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Button isIconOnly variant="ghost" size="sm" onPress={toggleTheme}>
            {theme === "light" ? <BsMoon /> : <BsSun />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SideNavbar />
      </div>

      {/* User Section */}
      {session && (
        <div className="p-4 ">
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100 cursor-pointer">
                <Avatar
                  name={session.user?.name || "User"}
                  src={session.user?.image || ""}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-default-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="profile">Profile</DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<BsBoxArrowRight />}
                onPress={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </aside>
  );
};

export default SidebarWrapper;
