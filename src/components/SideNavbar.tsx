import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  BsFileText,
  BsGear,
  BsPeople,
  BsJournal,
  BsTags,
} from "react-icons/bs";
import { usePageCheck } from "@/hooks/usePageCheck";
import { useSession, signOut } from "next-auth/react";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <BsFileText className="h-5 w-5 mr-2" />,
  },
  {
    href: "/taxonomies",
    label: "Taxonomies",
    icon: <BsTags className="h-5 w-5 mr-2" />,
  },
  {
    href: "/posts",
    label: "Posts",
    icon: <BsJournal className="h-5 w-5 mr-2" />,
  },
  {
    href: "/users",
    label: "Users",
    icon: <BsPeople className="h-5 w-5 mr-2" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <BsGear className="h-5 w-5 mr-2" />,
  },
];

const SideNavbar = () => {
  const pathname = usePageCheck();
  const { data: session } = useSession();

  return (
    <Navbar className="w-full h-screen flex flex-col justify-between items-start p-6">
      {/* Navigation Section */}
      <NavbarContent className="flex flex-col gap-4 w-full">
        {menuItems.map(({ href, label, icon }) => (
          <NavbarItem
            key={href}
            className="w-full flex justify-start"
            isActive={pathname.startsWith(href)}
          >
            <Link color="foreground" href={href} className="flex items-center">
              {icon}
              {label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* User Menu Section */}
      {session && (
        <div className="w-full pt-6 border-t border-border mt-auto">
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
            <DropdownMenu aria-label="User menu" className="min-w-[180px]">
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
    </Navbar>
  );
};

export default SideNavbar;
