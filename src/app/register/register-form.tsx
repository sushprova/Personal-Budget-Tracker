/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        setSuccess("Registration successful!");
        // Optionally, redirect the user or clear the form
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle
            className="all-heading block mb-2"
            style={{ fontSize: "1.5rem" }}
          >
            Register
          </CardTitle>
          <CardDescription>Welcome to Vésto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="username"
                  className="all-heading block mb-2"
                  style={{ fontSize: "1.3rem" }}
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="all-heading block mb-2"
                  style={{ fontSize: "1.3rem" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="all-heading block mb-2"
                  style={{ fontSize: "1.3rem" }}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="all-heading block mb-2 text-center bg-[#0A4F45]"
              >
                Register
              </Button>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm text-center">{success}</p>
              )}
            </div>
            <div
              className="all-heading block mb-2 text-center"
              style={{ fontSize: "1rem" }}
            >
              Already a user?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log In
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
