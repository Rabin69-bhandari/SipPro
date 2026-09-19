import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    const userPlan =
      user.publicMetadata?.userPlan || "free";

    console.log("👤 User:", userId);
    console.log("🎯 User Plan:", userPlan);

    return NextResponse.json({
      userId,
      userPlan,
    });
  } catch (error) {
    console.error("Failed to retrieve user plan:", error);

    return NextResponse.json(
      {
        error: "Failed to retrieve user plan",
      },
      { status: 500 }
    );
  }
}