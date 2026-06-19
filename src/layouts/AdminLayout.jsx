import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 ml-52 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-6">{children}</main>

        <footer className="border-t border-gray-200 bg-white px-6 py-4 text-xs text-gray-400">
          <span className="font-semibold text-blue-600">Apna mohalla</span>
          <span className="ml-3">© 2026 Apna mohalla</span>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;
