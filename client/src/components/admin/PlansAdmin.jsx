import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Loader2, Bus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CustomToast = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        px-4 py-3 rounded shadow-lg text-white z-50 
        ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white font-bold">
          ×
        </button>
      </div>
    </div>
  );
};

const ConfirmModal = ({ visible, onConfirm, onCancel, loading, planName }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl space-y-4">
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the "{planName}" plan? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const PlansAdmin = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    rides: "",
    price: "",
    location: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    id: null,
    name: "",
  });
  const allowedLocations = [
    "RamaMandi/Dakoha",
    "DeepNagar/Phagwara(all locations)",
    "LawGate/HardasPur/Maheru/Chaheru/AGI",
  ];

  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/plans`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPlans(res.data);
    } catch (err) {
      showError("Failed to load plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.rides) newErrors.rides = "Rides count is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.location) newErrors.location = "Location is required";
    if (!form.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/admin/plans/${editId}`,
          form,
          config
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/admin/plans-create`,
          form,
          config
        );
      }
      showToast(
        `Plan ${editId ? "updated" : "created"} successfully`,
        "success"
      );
      resetForm();
      fetchPlans();
    } catch (err) {
      showError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(confirmDelete.id);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/admin/plans/${confirmDelete.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      showToast("Plan deleted successfully", "success");
      fetchPlans();
    } catch (err) {
      showError("Failed to delete plan");
    } finally {
      setDeleteLoading(null);
      setConfirmDelete({ visible: false, id: null, name: "" });
    }
  };

  const resetForm = () => {
    setForm({ name: "", rides: "", price: "", location: "", description: "" });
    setEditId(null);
    setErrors({});
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showError = (message) => showToast(message, "error");

  return (
    <div className="max-w-4xl mx-auto p-6 mb-20 space-y-8">
      {toast && <CustomToast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        visible={confirmDelete.visible}
        onCancel={() =>
          setConfirmDelete({ visible: false, id: null, name: "" })
        }
        onConfirm={handleDelete}
        loading={deleteLoading === confirmDelete.id}
        planName={confirmDelete.name}
      />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Ride Plans</h1>
        <Button onClick={resetForm} variant="outline">
          <Plus size={16} className="mr-2" />
          {editId ? "Cancel Edit" : "Create New"}
        </Button>
      </div>

      {/* Form */}
      <Card className="p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "rides", "price", "location", "description"].map(
            (field) => (
              <div
                className={
                  field === "description"
                    ? "md:col-span-2 space-y-2"
                    : "space-y-2"
                }
                key={field}
              >
                {field === "location" ? (
                  <select
                    name="location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                  >
                    <option value="">Select Location</option>
                    {allowedLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    name={field}
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    type={
                      ["rides", "price"].includes(field) ? "number" : "text"
                    }
                  />
                )}

                {errors[field] && (
                  <p className="text-sm text-red-500">{errors[field]}</p>
                )}
              </div>
            )
          )}
        </div>

        <Button onClick={handleCreateOrUpdate} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editId ? "Update Plan" : "Create Plan"}
        </Button>
      </Card>

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No plans available. Create your first plan!
          </div>
        ) : (
          plans.map((plan) => (
            <Card
              key={plan._id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <Badge variant="outline" className="text-sm">
                      {plan.location}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Bus size={14} />
                      {plan.rides} rides
                    </span>
                    <span>₹{plan.price}</span>
                  </div>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>

                <div className="flex gap-2 self-end md:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setForm(plan);
                      setEditId(plan._id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setConfirmDelete({
                        visible: true,
                        id: plan._id,
                        name: plan.name,
                      })
                    }
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PlansAdmin;
