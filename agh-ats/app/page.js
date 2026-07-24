import Link from "next/link";

const stats = [
  ["Total Applicants", "128"],
  ["Pending Review", "14"],
  ["Available", "63"],
  ["Interview Scheduled", "9"],
];

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">A Good Helper</p>
          <h1>Dashboard</h1>
          <p>Manage applicants, interviews, suppliers and employer matching.</p>
        </div>
        <Link href="/applicants/new" className="primary-button">
          + Add Applicant
        </Link>
      </div>

      <section className="stats-grid">
        {stats.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Recent Applicants</h2>
            <p>Sample records for the first deployment.</p>
          </div>
          <Link href="/applicants">View all</Link>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Nationality</th>
                <th>Source</th>
                <th>Consultant</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Maria Santos</td>
                <td>Philippines</td>
                <td>ABC Supplier</td>
                <td>Eunice</td>
                <td><span className="badge available">Available</span></td>
              </tr>
              <tr>
                <td>Siti Nurhaliza</td>
                <td>Indonesia</td>
                <td>Facebook</td>
                <td>Sarah</td>
                <td><span className="badge review">Pending Review</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}