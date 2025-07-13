"use client";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Badge,
  Button,
} from "@heroui/react";
import { BsBell, BsBoxArrowRight } from "react-icons/bs";
import { useSession, signOut } from "next-auth/react";

const TopBar = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Navbar className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NavbarContent justify="end">
        <NavbarItem>
          <Badge content="3" color="danger" size="sm">
            <Button isIconOnly variant="ghost" size="sm">
              <BsBell className="h-5 w-5" />
            </Button>
          </Badge>
        </NavbarItem>
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  name={session.user?.name || "User"}
                  src={session.user?.image || ""}
                  size="sm"
                />
                <span className="text-sm font-medium hidden sm:block">
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
                startContent={<BsBoxArrowRight />}
                onPress={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default TopBar;