import AnnouncementsManager from "@/components/dashboard/AnnouncementsManager";
export const dynamic = 'force-dynamic';
export default function AdminAnnouncementsPage() {
  return <AnnouncementsManager roleLabel="Admin" />;
}
