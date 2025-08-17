"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@heroui/react";
import { BsSun, BsMoon, BsBoxArrowRight, BsList } from "react-icons/bs";
import SideNavbar from "./SideNavbar";
import { usePageCheck } from "@/hooks/usePageCheck";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/context/themeContext";
import { useState } from "react";

const SidebarWrapper = () => {
  const pathname = usePageCheck();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === "/login") {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          isIconOnly 
          variant="flat" 
          size="sm" 
          onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background shadow-md"
        >
          <BsList className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative lg:translate-x-0 transition-transform duration-300 z-50
        w-64 h-screen border border-primary-50 flex m-2 lg:m-4 shadow rounded-2xl flex-col
        bg-white dark:bg-gray-900
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-xl font-bold">Admin Panel</h1>
            <div className="flex gap-2">
              <Button isIconOnly variant="ghost" size="sm" onPress={toggleTheme}>
                {theme === "light" ? <BsMoon /> : <BsSun />}
              </Button>
              <Button 
                isIconOnly 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onPress={() => setIsMobileMenuOpen(false)}
              >
                ×
              </Button>
            </div>
          </div>
        </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SideNavbar />
      </div>

        {/* User Section */}
        {session && (
          <div className="p-3 lg:p-4">
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
    </>
  );
};

export default SidebarWrapper;
