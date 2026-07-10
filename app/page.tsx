import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

// This will print in your TERMINAL (VS Code terminal, CMD, etc.)
  console.log("DEBUG: Current User ID is:", userId);


  if (userId) {
    redirect("/editor");
  } else {
    redirect("/sign-in");
  }
}
