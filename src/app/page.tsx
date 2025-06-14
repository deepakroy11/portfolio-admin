// File: app/page.tsx
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to the Admin Panel
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 text-center">
            <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">
              Get Started
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Manage Your Content Effortlessly
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Dive into your latest metrics, view recent activity, and quickly
              create or update content using our intuitive dashboard.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Overview
                </h3>
                <p className="mt-2 text-gray-500">
                  Get a snapshot of your site's performance, recent posts, and
                  user activity.
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Manage Posts
                </h3>
                <p className="mt-2 text-gray-500">
                  Create, edit, or delete posts easily with our robust content
                  management tools.
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Management
                </h3>
                <p className="mt-2 text-gray-500">
                  Monitor user activity and manage permissions all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
