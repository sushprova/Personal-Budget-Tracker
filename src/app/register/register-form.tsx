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
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle
            className="all-heading  block mb-2 "
            style={{ fontSize: "1.5rem" }}
          >
            Register
          </CardTitle>
          <CardDescription>Welcome to Vésto</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="username"
                  className="all-heading  block mb-2 "
                  style={{ fontSize: "1.3rem" }}
                >
                  Username
                </Label>
                <Input id="username" type="text" required />
              </div>
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
              <div
                className="all-heading  block mb-2 "
                style={{ fontSize: "1.3rem" }}
              >
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="all-heading  block mb-2 "
                    style={{ fontSize: "1.3rem" }}
                  >
                    Password
                  </Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button
                type="submit"
                className="all-heading block mb-2 text-center bg-[#0A4F45]"
              >
                Register
              </Button>
            </div>
            <div
              className="all-heading  block mb-2 text-center"
              style={{ fontSize: "1rem" }}
            >
              Already an user?{" "}
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
