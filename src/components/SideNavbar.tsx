import { Link } from "@heroui/react";
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
    icon: BsFileText,
  },
  {
    href: "/taxonomies",
    label: "Taxonomies",
    icon: BsTags,
  },
  {
    href: "/posts",
    label: "Posts",
    icon: BsJournal,
  },
  {
    href: "/users",
    label: "Users",
    icon: BsPeople,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: BsGear,
  },
];

const SideNavbar = () => {
  const pathname = usePageCheck();

  return (
    <nav className="p-4">
      <div className="space-y-1">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-default-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SideNavbar;
