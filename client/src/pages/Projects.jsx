import { useEffect, useState } from "react";
import api from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Projects() {

  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    client_id: "",
    project_name: "",
    description: "",
    price: "",
    status: "pending",
    deadline: "",
  });


  // ===============================
  // FETCH DATA
  // ===============================

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);


  // ===============================
  // FORM HANDLING
  // ===============================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("/projects", {
        ...form,
        price: Number(form.price),
        client_id: Number(form.client_id),
      });

      // reset form
      setForm({
        client_id: "",
        project_name: "",
        description: "",
        price: "",
        status: "pending",
        deadline: "",
      });

      fetchProjects();

    } catch (err) {
      console.error("Project creation failed", err);
    }
  };


  // ===============================
  // STATUS BADGE STYLES
  // ===============================

  const statusBadge = (status) => {
    if (status === "completed")
      return "bg-green-100 text-green-700";

    if (status === "pending")
      return "bg-yellow-100 text-yellow-700";

    return "bg-gray-100 text-gray-600";
  };


  // ===============================
  // UI
  // ===============================

  return (
    <AppLayout title="Projects">


      {/* ===============================
          CREATE PROJECT FORM
      =============================== */}
      <div className="card p-5 sm:p-6 md:p-8 mb-8">

        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold">
            Create New Project
          </h3>

          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
            Assign client and define project details
          </p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-5">


          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* Client */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Client
              </label>

              <select
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select Client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}

              </select>
            </div>



            {/* Project Name */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Project Name
              </label>

              <input
                name="project_name"
                value={form.project_name}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>



            {/* Price */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Price
              </label>

              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>



            {/* Deadline */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Deadline
              </label>

              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>



            {/* Status */}
            <div>
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>



            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-[rgb(var(--color-text-muted))]">
                Description
              </label>

              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="input w-full"
              />
            </div>


          </div>


          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full md:w-auto"
            >
              Create Project
            </button>
          </div>


        </form>

      </div>



      {/* ===============================
          PROJECTS TABLE
      =============================== */}
      <div className="card">


        {loading ? (

          <div className="p-8 text-center text-[rgb(var(--color-text-muted))]">
            Loading projects...
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-[750px] w-full text-sm">

              <thead className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-soft))]">

                <tr className="text-left text-[rgb(var(--color-text-muted))]">

                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                    Project
                  </th>

                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                    Client
                  </th>

                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                    Price
                  </th>

                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                    Deadline
                  </th>

                  <th className="px-4 sm:px-6 py-4 font-medium whitespace-nowrap">
                    Status
                  </th>

                </tr>

              </thead>



              <tbody>

                {projects.map((project) => (

                  <tr
                    key={project.id}
                    className="border-b border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-soft))]"
                  >

                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-medium">
                      {project.project_name}
                    </td>


                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {project.client_name}
                    </td>


                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      ₹ {Number(project.price).toLocaleString("en-IN")}
                    </td>


                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {new Date(project.deadline).toLocaleDateString("en-IN")}
                    </td>


                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadge(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>

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