const applicants: {

  name: string;

  nationality: string;

  source: string;

  consultant: string;

  status: string;

}[] = [];

export default function Home() {

  return (

    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">

      <div className="flex min-h-screen">

        <aside className="relative w-64 bg-[#0f172a] px-5 py-6 text-white">

          <div className="mb-10 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 font-bold">

              AGH

            </div>

            <div>

              <h1 className="font-bold">AGH ATS</h1>

              <p className="text-xs text-slate-400">

                Applicant Tracking System

              </p>

            </div>

          </div>

          <nav className="space-y-2 text-sm">

            {[

              "Dashboard",

              "Applicants",

              "Employers",

              "Suppliers",

              "Consultants",

              "Interviews",

              "Reports",

              "Settings",

            ].map((item, index) => (

              <button

                key={item}

                className={`block w-full rounded-lg px-4 py-3 text-left ${

                  index === 0

                    ? "bg-white/10 font-semibold text-white"

                    : "text-slate-300 hover:bg-white/5"

                }`}

              >

                {item}

              </button>

            ))}

          </nav>

          <p className="absolute bottom-6 text-xs text-slate-500">

            AGH ATS Version 1

          </p>

        </aside>

        <section className="flex-1 px-8 py-8">

          <header className="mb-8 flex items-start justify-between">

            <div>

              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-600">

                A Good Helper

              </p>

              <h2 className="text-3xl font-bold">Dashboard</h2>

              <p className="mt-2 text-slate-500">

                Manage applicants, employers, suppliers and interviews.

              </p>

            </div>

            <button className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600">

              + Add Applicant

            </button>

          </header>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {[

              ["Total Applicants", "0"],

              ["Pending Review", "0"],

              ["Available", "0"],

              ["Interviews", "0"],

            ].map(([label, value]) => (

              <div

                key={label}

                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"

              >

                <p className="text-sm text-slate-500">{label}</p>

                <p className="mt-2 text-3xl font-bold">{value}</p>

              </div>

            ))}

          </div>

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <h3 className="text-xl font-bold">Recent Applicants</h3>

              <button className="text-sm font-semibold text-amber-600">

                View all

              </button>

            </div>

            {applicants.length === 0 ? (

              <div className="rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center">

                <p className="font-semibold text-slate-700">

                  No applicants found

                </p>

                <p className="mt-2 text-sm text-slate-500">

                  Applicant records will appear here after the database is

                  connected.

                </p>

              </div>

            ) : (

              <table className="w-full text-left text-sm">

                <thead>

                  <tr className="border-b border-slate-200 text-slate-500">

                    <th className="px-3 py-3 font-medium">Name</th>

                    <th className="px-3 py-3 font-medium">Nationality</th>

                    <th className="px-3 py-3 font-medium">Source</th>

                    <th className="px-3 py-3 font-medium">Consultant</th>

                    <th className="px-3 py-3 font-medium">Status</th>

                  </tr>

                </thead>

                <tbody>

                  {applicants.map((applicant) => (

                    <tr

                      key={applicant.name}

                      className="border-b border-slate-100"

                    >

                      <td className="px-3 py-4 font-semibold">

                        {applicant.name}

                      </td>

                      <td className="px-3 py-4">{applicant.nationality}</td>

                      <td className="px-3 py-4">{applicant.source}</td>

                      <td className="px-3 py-4">{applicant.consultant}</td>

                      <td className="px-3 py-4">{applicant.status}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </div>

    </main>

  );

}