import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "AGH ATS",
  description: "A Good Helper Applicant Tracking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}