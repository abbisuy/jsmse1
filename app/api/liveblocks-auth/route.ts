import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { checkProjectAccess } from "@/lib/project-access";
import { getUserColor, liveblocks } from "@/lib/liveblocks";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const room = typeof body.room === "string" ? body.room : "";
  if (!room) {
    return NextResponse.json({ error: "room is required" }, { status: 400 });
  }

  const access = await checkProjectAccess(room, userId);
  if (!access.ok) {
    if (access.reason === "not-found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let name = userId;
  let avatar = "";
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    );
    name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName ?? user.username ?? primary?.emailAddress ?? userId;
    avatar = user.imageUrl;
  } catch (error) {
    console.error("Clerk enrichment failed in /api/liveblocks-auth:", error);
  }

  try {
    await liveblocks.getOrCreateRoom(room, {
      defaultAccesses: ["room:write"],
    });
  } catch (error) {
    console.error("getOrCreateRoom failed in /api/liveblocks-auth:", error);
  }

  const { status, body: tokenBody } = await liveblocks.identifyUser(
    { userId, groupIds: [] },
    { userInfo: { name, avatar, color: getUserColor(userId) } }
  );

  return new Response(tokenBody, { status });
}
