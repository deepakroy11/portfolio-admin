import { Navbar, NavbarContent, NavbarItem, Link } from "@heroui/react";
import {
  BsFileText,
  BsGear,
  BsPeople,
  BsJournal,
  BsTags,
} from "react-icons/bs";
import { usePageCheck } from "@/hooks/usePageCheck";

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

  return (
    <Navbar className="w-full flex flex-col items-start">
      <NavbarContent className="flex flex-col gap-4 p-6">
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
    </Navbar>
  );
};

export default SideNavbar;
