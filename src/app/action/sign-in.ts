"use server";
import * as auth from "@/auth";

export async function signIn(agent: string) {
  return auth.signIn(agent, { redirectTo: "/dashboard" });
}
