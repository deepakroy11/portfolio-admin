import { db } from "@/db";
import { User } from "@prisma/client";

export const fetchUsers = () => {
  return db.user.findMany();
};
