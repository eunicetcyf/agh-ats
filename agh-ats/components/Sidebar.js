import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  UserRoundCog,
  Video,
  Settings
} from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applicants", label: "Applicants", icon: Users },
  { href: "/employers", label: "Employers", icon: Building2 },
  { href: "/suppliers", label: "Suppliers", icon: Handshake },
  { href: "/consultants", label: "Consultants", icon: UserRoundCog },
  { href: "/interviews", label: "Interviews", icon: Video },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">AGH</div>
        <div>
          <strong>AGH ATS</strong>
          <span>Applicant Tracking System</span>
        </div>
      </div>

      <nav>
        {items.map(({ href, label, icon: Icon }) => (
          <Link className="nav-link" href={href} key={href}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-note">
        Version 1.1<br />
        Passport OCR and expanded biodata.
      </div>
    </aside>
  );
}