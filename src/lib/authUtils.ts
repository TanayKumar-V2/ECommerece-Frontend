import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function verifyAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session;
}
