import { useEffect, useState } from "react";
import api from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Projects() {

  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    client_id: "",
    project_name: "",
    description: "",
    price: "",
    status: "pending",
    deadline: "",
  });


  // ===============================
  // FETCH PROJECTS
  // ===============================
  const fetchProjects = async () => {

    try {

      const res = await api.get("/projects");

      setProjects(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };


  // ===============================
  // FETCH CLIENTS
  // ===============================
  const fetchClients = async () => {

    try {

      const res = await api.get("/clients");

      setClients(res.data);

    } catch (err) {

      console.error(err);

    }

  };


  useEffect(() => {

    fetchProjects();
    fetchClients();

  }, []);



  // ===============================
  // INPUT CHANGE
  // ===============================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  // ===============================
  // CREATE OR UPDATE PROJECT
  // ===============================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        ...form,
        price: Number(form.price),
        client_id: Number(form.client_id),
      };


      if (editingId) {

        await api.put(`/projects/${editingId}`, payload);

      } else {

        await api.post("/projects", payload);

      }


      setForm({
        client_id: "",
        project_name: "",
        description: "",
        price: "",
        status: "pending",
        deadline: "",
      });

      setEditingId(null);

      fetchProjects();

    } catch (err) {

      console.error(err);

    }

  };



  // ===============================
  // EDIT PROJECT
  // ===============================
  const handleEdit = (project) => {

    setForm({
      client_id: project.client_id || "",
      project_name: project.project_name,
      description: project.description || "",
      price: project.price,
      status: project.status,
      deadline: project.deadline?.split("T")[0],
    });

    setEditingId(project.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };



  // ===============================
  // DELETE PROJECT
  // ===============================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this project?"
    );

    if (!confirmDelete) return;

    await api.delete(`/projects/${id}`);

    fetchProjects();

  };



  // ===============================
  // STATUS BADGE
  // ===============================
  const statusBadge = (status) => {

    if (status === "completed")
      return "bg-green-100 text-green-700";

    if (status === "pending")
      return "bg-yellow-100 text-yellow-700";

    return "bg-gray-100 text-gray-600";

  };



  return (

    <AppLayout title="Projects">


      {/* FORM */}
      <div className="card p-5 sm:p-6 md:p-8 mb-8">

        <h3 className="text-xl font-semibold mb-4">

          {editingId
            ? "Edit Project"
            : "Create Project"}

        </h3>


        <form onSubmit={handleSubmit} className="space-y-4">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* Client */}
            <select
              name="client_id"
              value={form.client_id}
              onChange={handleChange}
              required
              className="input"
            >

              <option value="">Select Client</option>

              {clients.map((client) => (

                <option key={client.id} value={client.id}>
                  {client.name}
                </option>

              ))}

            </select>



            {/* Project name */}
            <input
              name="project_name"
              value={form.project_name}
              onChange={handleChange}
              placeholder="Project name"
              required
              className="input"
            />



            {/* Price */}
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              required
              className="input"
            />



            {/* Deadline */}
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              className="input"
            />



            {/* Status */}
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >

              <option value="pending">
                Pending
              </option>

              <option value="completed">
                Completed
              </option>

            </select>



            {/* Description */}
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="input md:col-span-2"
            />


          </div>



          <div className="flex gap-3">

            <button className="btn-primary">

              {editingId
                ? "Update Project"
                : "Create Project"}

            </button>


            {editingId && (

              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    client_id: "",
                    project_name: "",
                    description: "",
                    price: "",
                    status: "pending",
                    deadline: "",
                  });
                }}
                className="px-4 py-2 border rounded-lg"
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
            Loading projects...
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-[750px] w-full">

              <thead>

                <tr>

                  <th className="p-4 text-left">
                    Project
                  </th>

                  <th className="p-4 text-left">
                    Client
                  </th>

                  <th className="p-4 text-left">
                    Price
                  </th>

                  <th className="p-4 text-left">
                    Deadline
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {projects.map((project) => (

                  <tr key={project.id} className="border-t">

                    <td className="p-4">
                      {project.project_name}
                    </td>

                    <td className="p-4">
                      {project.client_name}
                    </td>

                    <td className="p-4">
                      ₹{project.price}
                    </td>

                    <td className="p-4">
                      {new Date(project.deadline).toLocaleDateString()}
                    </td>

                    <td className="p-4">

                      <span className={`px-2 py-1 rounded ${statusBadge(project.status)}`}>
                        {project.status}
                      </span>

                    </td>

                    <td className="p-4 flex gap-3">

                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>


                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600"
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