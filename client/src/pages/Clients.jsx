import { useEffect, useState } from "react";
import api from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchClients = () => {
    api.get("/clients")
      .then((res) => setClients(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/clients", form);
    setForm({ name: "", email: "", phone: "", company: "" });
    fetchClients();
  };

  return (
    <AppLayout title="Clients">

      {/* Create Client Form */}
      <div className="card p-5 sm:p-6 md:p-8 mb-8">

        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold">
            Add New Client
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
            Enter client details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {["name", "email", "phone", "company"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-[rgb(var(--color-text-muted))] mb-1 capitalize">
                  {field}
                </label>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            ))}

          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary w-full md:w-auto">
              Create Client
            </button>
          </div>

        </form>
      </div>

      {/* Clients Table */}
      <div className="card">

        {loading ? (
          <div className="p-8 text-center text-[rgb(var(--color-text-muted))]">
            Loading clients...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-[600px] w-full text-sm">

              <thead className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-soft))]">
                <tr className="text-left text-[rgb(var(--color-text-muted))]">
                  <th className="px-4 sm:px-6 py-4 font-medium">Name</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Email</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Phone</th>
                  <th className="px-4 sm:px-6 py-4 font-medium">Company</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-soft))]"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {client.name}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-[rgb(var(--color-text-muted))]">
                      {client.email}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {client.phone}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {client.company}
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