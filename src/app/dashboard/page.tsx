import { Card, CardHeader, CardBody } from "@heroui/react";
import { getDashboardStats, getRecentPosts, getRecentUsers } from "@/db/queries/dashboard";
import { BsFileText, BsPeople, BsTags, BsFolder } from "react-icons/bs";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentPosts = await getRecentPosts();
  const recentUsers = await getRecentUsers();

  const metrics = [
    {
      title: "Total Posts",
      value: stats.postsCount,
      icon: BsFileText,
    },
    {
      title: "Total Users",
      value: stats.usersCount,
      icon: BsPeople,
    },
    {
      title: "Taxonomies",
      value: stats.taxonomiesCount,
      icon: BsTags,
    },
    {
      title: "Projects",
      value: stats.projectsCount,
      icon: BsFolder,
    },
  ];

  return (
    <main className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-default-500 mt-1">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(({ title, value, icon: Icon }) => (
            <Card key={title}>
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-default-500">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-default-400" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          <Card>
            <CardBody>
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-default-500">
                          By {post.user?.name || "Unknown"}
                        </p>
                      </div>
                      <span className="text-xs text-default-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-default-500">No posts yet</p>
              )}
            </CardBody>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <Card>
            <CardBody>
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{user.name || "Unnamed User"}</h3>
                        <p className="text-sm text-default-500">{user.email}</p>
                      </div>
                      <span className="text-xs text-default-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-default-500">No users yet</p>
              )}
            </CardBody>
          </Card>
        </section>
      </div>
    </main>
  );
}