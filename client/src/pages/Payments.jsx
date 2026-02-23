import { useEffect, useState } from "react";
import api from "../api/api";
import AppLayout from "../components/AppLayout";

export default function Payments() {

  const [summary, setSummary] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    project_id: "",
    amount: "",
    payment_date: "",
    payment_method: "UPI",
    notes: "",
  });



  // ===============================
  // FETCH SUMMARY
  // ===============================
  const fetchSummary = async () => {

    try {

      const res = await api.get("/projects/summary");

      setSummary(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };



  // ===============================
  // FETCH PROJECTS
  // ===============================
  const fetchProjects = async () => {

    try {

      const res = await api.get("/projects");

      setProjects(res.data);

    } catch (err) {

      console.error(err);

    }

  };



  // ===============================
  // FETCH PAYMENTS LIST
  // ===============================
  const fetchPayments = async () => {

    try {

      const res = await api.get("/payments");

      setPayments(res.data);

    } catch (err) {

      console.error(err);

    }

  };



  useEffect(() => {

    fetchSummary();
    fetchProjects();
    fetchPayments();

  }, []);




  // ===============================
  // HANDLE INPUT
  // ===============================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };



  // ===============================
  // CREATE OR UPDATE PAYMENT
  // ===============================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const payload = {
        ...form,
        project_id: Number(form.project_id),
        amount: Number(form.amount),
      };


      if (editingId) {

        await api.put(`/payments/${editingId}`, payload);

      } else {

        await api.post("/payments", payload);

      }


      setForm({
        project_id: "",
        amount: "",
        payment_date: "",
        payment_method: "UPI",
        notes: "",
      });

      setEditingId(null);

      fetchSummary();
      fetchPayments();

    } catch (err) {

      console.error(err);

    }

  };



  // ===============================
  // EDIT PAYMENT
  // ===============================
  const handleEdit = (payment) => {

    setForm({
      project_id: payment.project_id,
      amount: payment.amount,
      payment_date: payment.payment_date?.split("T")[0],
      payment_method: payment.payment_method,
      notes: payment.notes,
    });

    setEditingId(payment.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };



  // ===============================
  // DELETE PAYMENT
  // ===============================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this payment?"
    );

    if (!confirmDelete) return;

    await api.delete(`/payments/${id}`);

    fetchSummary();
    fetchPayments();

  };



  return (

    <AppLayout title="Payments">



      {/* ===============================
          FORM
      =============================== */}
      <div className="card p-6 mb-8">

        <h3 className="text-xl font-semibold mb-4">

          {editingId
            ? "Edit Payment"
            : "Add Payment"}

        </h3>


        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">


          <select
            name="project_id"
            value={form.project_id}
            onChange={handleChange}
            required
            className="input"
          >

            <option value="">
              Select Project
            </option>

            {projects.map(project => (

              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>

            ))}

          </select>



          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="input"
          />



          <input
            type="date"
            name="payment_date"
            value={form.payment_date}
            onChange={handleChange}
            required
            className="input"
          />



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



          <input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="input md:col-span-2"
          />



          <div className="flex gap-3 md:col-span-2">

            <button className="btn-primary">

              {editingId
                ? "Update Payment"
                : "Add Payment"}

            </button>


            {editingId && (

              <button
                type="button"
                onClick={() => {

                  setEditingId(null);

                  setForm({
                    project_id: "",
                    amount: "",
                    payment_date: "",
                    payment_method: "UPI",
                    notes: "",
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




      {/* ===============================
          PAYMENT LIST TABLE
      =============================== */}
      <div className="card mb-8">

        <div className="p-4 font-semibold border-b">
          Payments
        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[700px] w-full">

            <thead>

              <tr className="border-b">

                <th className="p-4 text-left">
                  Project
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Method
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {payments.map(payment => {

                const project =
                  projects.find(p => p.id === payment.project_id);

                return (

                  <tr key={payment.id} className="border-b">

                    <td className="p-4">
                      {project?.project_name}
                    </td>

                    <td className="p-4">
                      ₹{payment.amount}
                    </td>

                    <td className="p-4">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {payment.payment_method}
                    </td>

                    <td className="p-4 flex gap-3">

                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>


                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>




      {/* ===============================
          SUMMARY TABLE
      =============================== */}
      <div className="card">

        <div className="p-4 font-semibold border-b">
          Project Summary
        </div>


        <div className="overflow-x-auto">

          <table className="min-w-[650px] w-full">

            <thead>

              <tr className="border-b">

                <th className="p-4 text-left">
                  Project
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

                <th className="p-4 text-left">
                  Paid
                </th>

                <th className="p-4 text-left">
                  Pending
                </th>

              </tr>

            </thead>


            <tbody>

              {summary.map(item => (

                <tr key={item.id} className="border-b">

                  <td className="p-4">
                    {item.project_name}
                  </td>

                  <td className="p-4">
                    ₹{item.price}
                  </td>

                  <td className="p-4 text-green-600">
                    ₹{item.total_paid}
                  </td>

                  <td className="p-4 text-red-600">
                    ₹{item.pending_amount}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>



    </AppLayout>

  );

}