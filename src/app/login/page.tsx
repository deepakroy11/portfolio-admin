import { Card, CardHeader } from "@heroui/react";

export default function LoginPage() {
  return (
    <main className="flex-1 p-8 space-y-10">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings Page</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, Deepak! Here’s a quick overview of your site's
          performance.
        </p>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Total Posts</h3>
            </CardHeader>
            <div className="p-4">
              <p className="text-3xl font-bold">42</p>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Total Users</h3>
            </CardHeader>
            <div className="p-4">
              <p className="text-3xl font-bold">128</p>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Page Views</h3>
            </CardHeader>
            <div className="p-4">
              <p className="text-3xl font-bold">3.2K</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <div className="max-h-64 overflow-y-auto">
            <ul className="divide-y mb-2 divide-border">
              {[
                {
                  user: "John Doe",
                  action: "published a new post",
                  time: "10 minutes ago",
                },
                {
                  user: "Jane Smith",
                  action: "updated a user profile",
                  time: "30 minutes ago",
                },
                {
                  user: "System",
                  action: "reported a new comment pending review",
                  time: "1 hour ago",
                },
              ].map((activity, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-muted transition-colors rounded"
                >
                  <p>
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </main>
  );
}
