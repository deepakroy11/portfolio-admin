import { Link } from "@heroui/react";
import {
  BsFileText,
  BsGear,
  BsPeople,
  BsJournal,
  BsTags,
} from "react-icons/bs";
import { usePageCheck } from "@/hooks/usePageCheck";

const blogMenuItems = [
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
];

const portfolioMenuItems = [
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
      <div className="space-y-6">
        {/* Blog Section */}
        <div>
          <h3 className="text-xs font-semibold text-default-500 uppercase tracking-wider mb-2 px-3">
            Blog
          </h3>
          <div className="space-y-1">
            {blogMenuItems.map(({ href, label, icon: Icon }) => {
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
        </div>

        {/* Portfolio Section */}
        <div>
          <h3 className="text-xs font-semibold text-default-500 uppercase tracking-wider mb-2 px-3">
            Portfolio
          </h3>
          <div className="space-y-1">
            {portfolioMenuItems.map(({ href, label, icon: Icon }) => {
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
        </div>
      </div>
    </nav>
  );
};

export default SideNavbar;
