import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = { title: "Panel de administración" };

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-paper">
      <AdminHeader />
      {children}
    </div>
  );
}
