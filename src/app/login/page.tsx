"use client";

import { Input, Button, Card, CardBody, Divider } from "@heroui/react";
import { signIn } from "next-auth/react";
import { BsGoogle, BsGithub, BsKeyFill } from "react-icons/bs";
import { DiverWithText } from "@/components/common/DividerWithText";

export default function LoginPage() {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center bg-base-100 space-y-6">
      <h1 className="text-4xl">Portfolio | Admin Panel</h1>

      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardBody className="space-y-6 text-center">
          <h2 className="text-xl font-bold">Sign In</h2>
          <Divider />
          <form className="space-y-4 text-left">
            <Input
              type="text"
              name="userid"
              label="User Id"
              placeholder="Please enter user id"
              className="mb-5"
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="Please enter password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              startContent={<BsKeyFill className="h-5 w-5 rotate-60" />}
            >
              Sign in with Credentials
            </Button>
          </form>

          <DiverWithText text="or" />

          <div className="space-y-2">
            <Button
              className="w-full"
              startContent={<BsGithub className="w-5 h-5" />}
              onPress={() => signIn("github", { callbackUrl: "/dashboard" })}
            >
              Sign in with GitHub
            </Button>
            <Button
              className="w-full"
              startContent={<BsGoogle className="w-5 h-5" />}
              onPress={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              Sign in with Google
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
