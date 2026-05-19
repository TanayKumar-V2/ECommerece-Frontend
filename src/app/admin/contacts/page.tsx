import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import ContactsClient from "@/components/admin/ContactsClient";
import { verifyAdmin } from "@/lib/authUtils";

export const dynamic = 'force-dynamic';

export default async function AdminContactsPage() {
  await verifyAdmin();
  await dbConnect();
  const raw = await ContactMessage.find({}).sort({ createdAt: -1 }).lean() as any[];
  const messages = raw.map((m: any) => ({
    id: m._id.toString(),
    name: m.name,
    email: m.email,
    phone: m.phone,
    query: m.query,
    status: m.status,
    createdAt: m.createdAt.toISOString(),
  }));

  return <ContactsClient initialMessages={messages} />;
}
