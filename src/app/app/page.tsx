import { redirect } from "next/navigation";

// The dashboard merged into the home hub — keep old links working.
export default function AppRedirect() {
  redirect("/");
}
