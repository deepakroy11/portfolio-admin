import { Navbar, NavbarContent, NavbarItem, Link } from "@heroui/react";

const SideNavbar = () => {
  return (
    <Navbar className="w-full flex flex-col items-start">
      {/* Primary Navigation */}
      <NavbarContent className="flex flex-col gap-4 p-6">
        <NavbarItem className="w-full flex justify-start" isActive>
          <Link color="foreground" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem className="w-full flex justify-start">
          <Link color="foreground" href="/posts">
            Taxonomies
          </Link>
        </NavbarItem>
        <NavbarItem className="w-full flex justify-start">
          <Link color="foreground" href="/posts">
            Posts
          </Link>
        </NavbarItem>
        <NavbarItem className="w-full flex justify-start">
          <Link color="foreground" href="/users">
            Users
          </Link>
        </NavbarItem>
        <NavbarItem className="w-full flex justify-start">
          <Link color="foreground" href="/settings">
            Settings
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default SideNavbar;
