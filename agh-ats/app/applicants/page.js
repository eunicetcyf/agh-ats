import Link from "next/link";

export default function ApplicantsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Applicant Management</p>
          <h1>Applicants</h1>
          <p>Search, review and manage all applicant profiles.</p>
        </div>
        <Link href="/applicants/new" className="primary-button">
          + New Applicant
        </Link>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input placeholder="Search applicant name..." />
          <select defaultValue="">
            <option value="">All statuses</option>
            <option>Pending Review</option>
            <option>Available</option>
            <option>Interview</option>
            <option>Reserved</option>
            <option>Placed</option>
          </select>
        </div>

        <div className="empty-state">
          <h3>Applicant database ready</h3>
          <p>Supabase permanent saving will be connected in the next stage.</p>
          <Link href="/applicants/new" className="secondary-button">
            Create first applicant
          </Link>
        </div>
      </section>
    </div>
  );
}