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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle
            className="all-heading  block mb-2 "
            style={{ fontSize: "1.5rem" }}
          >
            Login
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="all-heading  block mb-2 "
                  style={{ fontSize: "1.3rem" }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="all-heading  block mb-2 "
                    style={{ fontSize: "1.3rem" }}
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="all-heading mb-2 text-center ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button
                type="submit"
                className="all-heading block mb-2 text-center bg-[#0A4F45]"
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="all-heading  block mb-2 "
                style={{ fontSize: "1rem" }}
              >
                Login with Google
              </Button>
            </div>
            <div
              className="all-heading  block mb-2 text-center"
              style={{ fontSize: "1rem" }}
            >
              Don&apos;t have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
