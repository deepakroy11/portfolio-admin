// components/HeaderBar.tsx
"use client";

import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";

export default function HeaderBar() {
  const { data: session } = useSession();

  return (
    <div className="w-full flex justify-end items-center px-6 py-4 bg-base-200 shadow-sm">
      {session && (
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              name={session.user?.name || "User"}
              src={session.user?.image || ""}
              className="cursor-pointer"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User menu" className="min-w-[180px]">
            <DropdownItem key="profile">Profile</DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
