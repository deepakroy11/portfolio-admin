"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CheckSession() {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    setCookies(document.cookie);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debugging</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Session Status</h2>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Authenticated:</strong> {status === "authenticated" ? "Yes" : "No"}</p>
      </div>

      {session && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Session Data</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Cookies</h2>
        <pre className="bg-gray-100 p-2 rounded overflow-auto">
          {cookies.split(';').map(cookie => cookie.trim()).join('\n')}
        </pre>
      </div>

      <div className="flex gap-4">
        <a href="/api/debug-session" className="px-4 py-2 bg-blue-500 text-white rounded">
          Check API Session
        </a>
        <a href="/api/auth/signin" className="px-4 py-2 bg-green-500 text-white rounded">
          Sign In
        </a>
        <a href="/api/auth/signout" className="px-4 py-2 bg-red-500 text-white rounded">
          Sign Out
        </a>
      </div>
    </div>
  );
}