import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("Missing github oauth credentials");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }),
    Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET }),
  ],
  // session: {
  //   strategy: "database", // or "jwt" if you prefer
  // },
  pages: {
    signIn: "/login",
  },
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     return !!auth;
  //   },
  //   async redirect({ url, baseUrl }) {
  //     return "/dashboard";
  //   },
  // },
});
