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
    <div className="flex flex-col justify-center w-full">
      <h2 className="text-bold justify-center py-2 inline-block">Menu</h2>
      <Navbar className="h-screen flex flex-col justify-between bg-base-200">
        <NavbarContent className="flex flex-col gap-4">
          {menuItems.map(({ href, label, icon }) => (
            <NavbarItem
              key={href}
              className="w-full flex justify-start"
              isActive={pathname.startsWith(href)}
            >
              <Link
                color="foreground"
                href={href}
                className="flex items-center"
              >
                {icon}
                {label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default SideNavbar;
