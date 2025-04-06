import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Loader,
  Plus,
  RefreshCw,
  Calendar,
  Edit2,
  Trash2,
} from "lucide-react";

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedLocation, setSelectedLocation] = useState("Delhi");
  const [selectedDirection, setSelectedDirection] = useState("");
  const [locations] = useState(["Delhi", "Noida", "Gurgaon", "Faridabad"]);
  const [editSlot, setEditSlot] = useState(null);

  const timeRef = useRef(null);
  const capacityRef = useRef(null);

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, selectedLocation, selectedDirection]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `${
        import.meta.env.VITE_BASE_URL
      }/api/admin/slots?date=${selectedDate}`;
      if (selectedLocation !== "all") url += `&location=${selectedLocation}`;
      if (selectedDirection !== "all") url += `&direction=${selectedDirection}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load slots");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async (location, date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/generate-slots`,
        { location, date },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSlots();
    } catch (err) {
      setError("Failed to generate slots");
      console.error(err);
    }
  };

  const autoGenerateNextDaySlots = async (location) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/admin/auto-generate-next",
        { location },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSlots();
    } catch (err) {
      setError("Failed to auto-generate next day slots");
      console.error(err);
    }
  };

  const updateSlot = async (slotId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/admin/slots/${slotId}`,
        {
          time: timeRef.current.value,
          capacity: capacityRef.current.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSlots();
      setEditSlot(null);
    } catch (err) {
      setError("Failed to update slot");
      console.error(err);
    }
  };

  const deleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/admin/slots/${slotId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSlots();
    } catch (err) {
      setError("Failed to delete slot. It may have existing bookings.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 py-12 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Slots</h1>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Generate Slots
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Daily Slots</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">Location</label>
                  <Select
                    defaultValue={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">Date</label>
                  <Input
                    className="col-span-3"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={() =>
                      generateSlots(selectedLocation, selectedDate)
                    }
                  >
                    Generate
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => autoGenerateNextDaySlots(selectedLocation)}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Auto Next Day
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Direction
              </label>
              <Select
                value={selectedDirection}
                onValueChange={setSelectedDirection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="to_college">To College</SelectItem>
                  <SelectItem value="from_college">From College</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slots List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No slots found for the selected criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Booked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot._id}>
                      <TableCell>
                        {format(new Date(slot.date), "dd MMM, yyyy")}
                      </TableCell>
                      <TableCell>{slot.location}</TableCell>
                      <TableCell>{slot.time}</TableCell>
                      <TableCell>
                        {slot.direction === "to_college"
                          ? "To College"
                          : "From College"}
                      </TableCell>
                      <TableCell>{slot.capacity}</TableCell>
                      <TableCell>
                        {slot.students.length}/{slot.capacity}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditSlot(slot)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Slot</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right font-medium">
                                    Time
                                  </label>
                                  <Input
                                    ref={timeRef}
                                    className="col-span-3"
                                    defaultValue={slot.time}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <label className="text-right font-medium">
                                    Capacity
                                  </label>
                                  <Input
                                    ref={capacityRef}
                                    type="number"
                                    className="col-span-3"
                                    defaultValue={slot.capacity}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button onClick={() => updateSlot(slot._id)}>
                                    Update
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSlot(slot._id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotManagement;
