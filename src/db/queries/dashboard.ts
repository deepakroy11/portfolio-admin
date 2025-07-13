import { db } from "@/db";

export const getDashboardStats = async () => {
  const [postsCount, usersCount, taxonomiesCount, projectsCount] = await Promise.all([
    db.post.count(),
    db.user.count(),
    db.taxonomy.count(),
    db.project.count(),
  ]);

  return {
    postsCount,
    usersCount,
    taxonomiesCount,
    projectsCount,
  };
};

export const getRecentPosts = async (limit = 5) => {
  return db.post.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
};

export const getRecentUsers = async (limit = 5) => {
  return db.user.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
};