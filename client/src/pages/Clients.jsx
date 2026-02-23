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

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);


  // ===============================
  // FETCH CLIENTS
  // ===============================
  const fetchClients = async () => {

    try {

      const res = await api.get("/clients");

      setClients(res.data);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchClients();

  }, []);



  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  // ===============================
  // CREATE OR UPDATE CLIENT
  // ===============================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (editingId) {

      await api.put(`/clients/${editingId}`, form);

    } else {

      await api.post("/clients", form);

    }

    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
    });

    setEditingId(null);

    fetchClients();

  };



  // ===============================
  // EDIT CLIENT
  // ===============================
  const handleEdit = (client) => {

    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
    });

    setEditingId(client.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };



  // ===============================
  // DELETE CLIENT
  // ===============================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this client?"
    );

    if (!confirmDelete) return;

    await api.delete(`/clients/${id}`);

    fetchClients();

  };



  return (

    <AppLayout title="Clients">


      {/* FORM */}
      <div className="card p-5 sm:p-6 md:p-8 mb-8">

        <div className="mb-6">

          <h3 className="text-lg sm:text-xl font-semibold">

            {editingId
              ? "Edit Client"
              : "Add New Client"}

          </h3>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">

            {editingId
              ? "Update client details"
              : "Enter client details"}

          </p>

        </div>


        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {["name", "email", "phone", "company"].map((field) => (

              <div key={field}>

                <label className="block text-sm mb-1 capitalize">

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


          <div className="pt-2 flex gap-3">

            <button
              type="submit"
              className="btn-primary"
            >
              {editingId
                ? "Update Client"
                : "Create Client"}
            </button>


            {editingId && (

              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                  });
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>



      {/* TABLE */}
      <div className="card">

        {loading ? (

          <div className="p-8 text-center">
            Loading clients...
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-[700px] w-full text-sm">

              <thead className="border-b">

                <tr>

                  <th className="px-4 py-4">Name</th>

                  <th className="px-4 py-4">Email</th>

                  <th className="px-4 py-4">Phone</th>

                  <th className="px-4 py-4">Company</th>

                  <th className="px-4 py-4">Actions</th>

                </tr>

              </thead>


              <tbody>

                {clients.map((client) => (

                  <tr key={client.id} className="border-b">

                    <td className="px-4 py-4">
                      {client.name}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      {client.email}
                    </td>

                    <td className="px-4 py-4">
                      {client.phone}
                    </td>

                    <td className="px-4 py-4">
                      {client.company}
                    </td>


                    <td className="px-4 py-4 flex gap-3">

                      <button
                        onClick={() => handleEdit(client)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>


                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>

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