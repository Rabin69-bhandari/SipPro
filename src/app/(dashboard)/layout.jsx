"use server"

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClientWrapper from "./DashboardClientWrapper";
export default async function DashboardLayout({
  children}) {
  const { userId } = await auth();

  // User is not signed in
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div>


      <DashboardClientWrapper>
      {children}
      </DashboardClientWrapper>
    </div>
  );
}