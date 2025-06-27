import { Button, Chip, Link } from "@heroui/react";
import UserListClient from "./userListClient";
import { db } from "@/db";

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      Authenticator: true,
      accounts: true,
      sessions: true,
      Post: true,
    },
  });

  return (
    <main className="flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <span>All User</span> <Chip variant="shadow">{users.length}</Chip>
        </h1>
        <Button as={Link} href="users/add">
          Add New User
        </Button>
      </div>

      {/* Key Metrics */}
      <section>
        <UserListClient users={users} />
      </section>
    </main>
  );
}
