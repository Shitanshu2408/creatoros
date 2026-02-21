import { useEffect, useState } from "react";
import api from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Payments() {
  const [summary, setSummary] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    project_id: "",
    amount: "",
    payment_date: "",
    payment_method: "UPI",
    notes: "",
  });

  const fetchSummary = () => {
    api.get("/projects/summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  };

  const fetchProjects = () => {
    api.get("/projects").then((res) => setProjects(res.data));
  };

  useEffect(() => {
    fetchSummary();
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/payments", {
      ...form,
      project_id: Number(form.project_id),
      amount: Number(form.amount),
    });

    setForm({
      project_id: "",
      amount: "",
      payment_date: "",
      payment_method: "UPI",
      notes: "",
    });

    fetchSummary();
  };

  return (
    <AppLayout title="Payments">

      {/* Add Payment Form */}
      <div className="card p-5 sm:p-6 md:p-8 mb-8">

        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold">
            Add Payment
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
            Record incoming payments for projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Project */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Project
              </label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Payment Date
              </label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Method */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Method
              </label>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="input"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Notes
              </label>
              <input
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary w-full md:w-auto">
              Add Payment
            </button>
          </div>

        </form>
      </div>

      {/* Summary Table */}
      <div className="card">

        {loading ? (
          <div className="p-8 text-center text-[rgb(var(--color-text-muted))]">
            Loading payments...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-[650px] w-full text-sm">

              <thead className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-soft))]">
                <tr className="text-left text-[rgb(var(--color-text-muted))]">
                  <th className="px-4 sm:px-6 py-4 font-medium">Project</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Total</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Paid</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Pending</th>
                </tr>
              </thead>

              <tbody>
                {summary.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-soft))]"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {item.project_name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      ₹ {Number(item.price).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                      ₹ {Number(item.total_paid).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-red-500 font-medium">
                      ₹ {Number(item.pending_amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

    </AppLayout>
  );
}