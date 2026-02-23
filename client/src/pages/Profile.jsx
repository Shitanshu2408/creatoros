import { useState } from "react";
import AppLayout from "../components/AppLayout";

export default function Profile() {

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  const handleSave = () => {

    // Update localStorage
    const updatedUser = {
      ...storedUser,
      name: form.name,
      phone: form.phone,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated successfully");

    window.location.reload();

  };


  return (

    <AppLayout title="Profile">

      <div className="max-w-xl">

        <div className="card p-6">

          <h2 className="text-lg font-semibold mb-6">
            Edit Profile
          </h2>


          <div className="space-y-4">

            {/* Name */}
            <div>

              <label className="block text-sm mb-1">
                Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
              />

            </div>


            {/* Email */}
            <div>

              <label className="block text-sm mb-1">
                Email
              </label>

              <input
                value={form.email}
                disabled
                className="input bg-gray-100 cursor-not-allowed"
              />

            </div>


            {/* Phone */}
            <div>

              <label className="block text-sm mb-1">
                Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="Enter phone number"
              />

            </div>


            <button
              onClick={handleSave}
              className="btn-primary"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}