"use client";

import {
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import type {
  User,
  Account,
  Authenticator,
  Session,
  Post,
} from "@prisma/client";
import Link from "next/link";

import {
  BsGoogle,
  BsGithub,
  BsGlobeCentralSouthAsia,
  BsPencilSquare,
  BsTrash3,
} from "react-icons/bs";

interface ExtendedUser extends User {
  accounts: Account[];
  Authenticator: Authenticator[];
  sessions: Session[];
  Post: Post[];
}

interface UsersProps {
  users: ExtendedUser[];
}

const UserListClient = ({ users }: UsersProps) => {
  console.log(users);
  return (
    <Table>
      <TableHeader>
        <TableColumn>SL</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Auth Client</TableColumn>
        <TableColumn>Posts</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-4">
                <Avatar
                  showFallback
                  name={user.name || "User"}
                  src={user.image || ""}
                  isBordered
                />
                <span>{user.name}</span>
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <div className="flex justify-start items-center space-x-2">
                {user.accounts && user.accounts.length > 0
                  ? user.accounts.map((acc) =>
                      acc.provider == "google" ? (
                        <BsGoogle className="h-5 w-5" />
                      ) : acc.provider == "github" ? (
                        <BsGithub className="h-5 w-5" />
                      ) : (
                        <BsGlobeCentralSouthAsia className="h-5 w-5" />
                      )
                    )
                  : "None"}
              </div>
            </TableCell>
            <TableCell>
              <Chip className="font-semibold">{user.Post.length}</Chip>
            </TableCell>
            <TableCell>
              <div className="flex justify-start items-center">
                <Link href={`#`}>
                  <BsPencilSquare className="w-5 h-5 me-2" />
                </Link>
                <Link href={`#`}>
                  <BsTrash3 className="w-5 h-5 text-danger" />
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserListClient;
