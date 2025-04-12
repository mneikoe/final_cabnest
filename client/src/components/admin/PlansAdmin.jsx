import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

const PlansAdmin = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ name: "", rides: "", price: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      console.error("Error fetching plans", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateOrUpdate = async () => {
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
      setForm({ name: "", rides: "", price: "" });
      setEditId(null);
      fetchPlans();
    } catch (err) {
      console.error("Error saving plan", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/admin/plans/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPlans();
    } catch (err) {
      console.error("Error deleting plan", err);
    }
  };

  const handleEdit = (plan) => {
    setForm(plan);
    setEditId(plan._id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-xl font-bold">Manage Ride Plans</h2>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Plan Name"
          />
          <Input
            name="rides"
            value={form.rides}
            onChange={handleChange}
            placeholder="Rides"
            type="number"
          />
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price ₹"
            type="number"
          />
        </div>
        <Button onClick={handleCreateOrUpdate} disabled={loading}>
          {editId ? "Update Plan" : "Create Plan"}
        </Button>
      </Card>

      <div className="space-y-4">
        {plans.map((plan) => (
          <Card
            key={plan._id}
            className="p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">{plan.name}</p>
              <p className="text-gray-500 text-sm">
                {plan.rides} rides · ₹{plan.price}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => handleEdit(plan)}>
                <Pencil size={18} />
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(plan._id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlansAdmin;
