import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Loader,
  Plus,
  RefreshCw,
  Calendar,
  Edit2,
  Trash2,
  MapPin,
  ArrowRightLeft,
  Clock,
  Users,
  AlertTriangle,
  X,
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
  const [locations] = useState([
    "Delhi",
    "RamaMandi/DeepNagar/AGI",
    "Phagwara",
    "LawGate/HardasPur/Maheru/Chaheru",
  ]);
  const [editSlot, setEditSlot] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

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
      setLastUpdated(new Date());
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSlots();
    } catch (err) {
      setError("Failed to generate slots");
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
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSlots();
    } catch (err) {
      setError("Failed to delete slot. It may have existing bookings.");
      console.error(err);
    }
  };

  const StatusBadge = ({ booked, capacity }) => {
    const percentage = (booked / capacity) * 100;
    return (
      <Badge
        variant="outline"
        className={`text-xs ${
          percentage >= 90
            ? "bg-red-100 text-red-800"
            : percentage >= 50
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {percentage >= 90 ? "Full" : percentage >= 50 ? "Busy" : "Available"}
      </Badge>
    );
  };

  const Alert = ({ message, onClose }) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-red-600 h-5 w-5" />
        <span className="text-red-700">{message}</span>
      </div>
      <button onClick={onClose} className="hover:opacity-75">
        <X className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 mb-20 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Clock className="h-6 w-6 text-indigo-600" />
            Slot Management
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage transportation slots and monitor bookings
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={fetchSlots} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden md:inline">Refresh</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Slots
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Generate New Slots
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
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
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => generateSlots(selectedLocation, selectedDate)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Generate Slots
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <Alert message={error} onClose={() => setError(null)} />}

      <Card className="bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                {format(parseISO(selectedDate), "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
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
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Direction
              </label>
              <Select
                value={selectedDirection}
                onValueChange={setSelectedDirection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All directions" />
                </SelectTrigger>
                <SelectContent>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-lg">Available Slots</CardTitle>
              <CardDescription className="text-sm">
                Last updated: {format(lastUpdated, "MMM d, yyyy 'at' h:mm a")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="mt-2 md:mt-0">
              {slots.length} slots found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500">
                No slots found for selected criteria
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((slot) => {
                    const percentage =
                      (slot.students.length / slot.capacity) * 100;
                    const time = new Date(`2022-01-01T${slot.time}`);

                    return (
                      <TableRow key={slot._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {format(new Date(slot.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>{slot.location}</TableCell>
                        <TableCell>{format(time, "hh:mm a")}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {slot.direction === "to_college"
                              ? "To Campus"
                              : "From Campus"}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>
                              {slot.students.length}/{slot.capacity}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            booked={slot.students.length}
                            capacity={slot.capacity}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditSlot(slot)}
                                >
                                  <Edit2 className="h-4 w-4 text-indigo-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Slot</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteSlot(slot._id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Slot</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Slot Dialog */}
      <Dialog open={!!editSlot} onOpenChange={() => setEditSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Edit Slot Details
            </DialogTitle>
          </DialogHeader>
          {editSlot && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  ref={timeRef}
                  defaultValue={editSlot.time}
                  placeholder="HH:MM"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  ref={capacityRef}
                  type="number"
                  defaultValue={editSlot.capacity}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => updateSlot(editSlot?._id)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SlotManagement;
