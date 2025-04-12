import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Loader,
  UserPlus,
  Search,
  MoreHorizontal,
  Plus,
  X,
  Clock,
  MapPin,
  ArrowRightLeft,
  User,
  RefreshCw, // Added RefreshCw icon
  Calendar, // Added Calendar icon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewBookingsFor, setViewBookingsFor] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [ridesToAdd, setRidesToAdd] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);
  const fetchStudentBookings = async (studentId) => {
    try {
      setBookingsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/admin/students/${studentId}/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookingsData(response.data || []);
      setViewBookingsFor(studentId);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setBookingsData([]); // fallback in case of error
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/admin/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRidesToStudent = async (studentId, rides) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/admin/students/${studentId}/add-rides`,
        { rides },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchStudents();
      setSelectedStudent(null);
    } catch (err) {
      setError("Failed to add rides");
      console.error(err);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.location &&
        student.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const RidesStatus = ({ rides }) => {
    const percentage = (rides / 40) * 100; // Assuming max 40 rides
    return (
      <div className="flex items-center gap-2 w-32">
        <Progress value={percentage} className="h-2 w-20" />
        <span className="text-sm font-medium">{rides}</span>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const statusMap = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-yellow-100 text-yellow-800", label: "Inactive" },
      blocked: { color: "bg-red-100 text-red-800", label: "Blocked" },
    };

    return (
      <Badge
        variant="outline"
        className={`text-xs ${statusMap[status]?.color || "bg-gray-100"}`}
      >
        {statusMap[status]?.label || "Unknown"}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mb-20 py-8 px-4 md:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            Student Management
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage student accounts and ride allocations
          </p>
        </div>

        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              className="pl-10 pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gray-50 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Students List</CardTitle>
              <CardDescription className="text-sm">
                {filteredStudents.length} students found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchStudents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 m-6 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <User className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500">
                No students found matching your search
              </p>
            </div>
          ) : (
            <Table className="border-t">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  {[
                    "Student",
                    "Contact",
                    "Location",
                    "Rides Remaining",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <TableHead
                      key={header}
                      className="font-medium text-gray-700"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow
                    key={student._id}
                    className="hover:bg-gray-50 group"
                  >
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      {student.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{student.email}</span>
                        <span className="text-sm text-gray-500">
                          {student.phone || "No phone number"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-sm">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        {student.location || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RidesStatus rides={student.remainingRides} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={student.status || "active"} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                <Plus className="mr-2 h-4 w-4 text-green-600" />
                                Add Rides
                              </DropdownMenuItem>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Plus className="h-5 w-5" />
                                  Add Rides for {student.name}
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      Current Rides:
                                    </span>
                                    <span className="text-blue-600 font-semibold">
                                      {student.remainingRides}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Rides to Add
                                  </label>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="Enter number of rides"
                                    className="text-lg"
                                    value={ridesToAdd}
                                    onChange={(e) =>
                                      setRidesToAdd(e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    if (
                                      !ridesToAdd ||
                                      isNaN(ridesToAdd) ||
                                      ridesToAdd < 1
                                    ) {
                                      setError(
                                        "Please enter a valid number of rides"
                                      );
                                      return;
                                    }
                                    addRidesToStudent(student._id, ridesToAdd);
                                  }}
                                  className="w-full"
                                >
                                  Confirm Addition
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault();
                                  fetchStudentBookings(student._id);
                                }}
                                className="cursor-pointer"
                              >
                                <Clock className="mr-2 h-4 w-4 text-purple-600" />
                                View Bookings
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </Dialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bookings Dialog */}
      {viewBookingsFor && (
        <Dialog
          open={!!viewBookingsFor}
          onOpenChange={() => setViewBookingsFor(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Booking History
              </DialogTitle>
            </DialogHeader>

            {bookingsLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : bookingsData.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-500">
                  No bookings found for this student
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {bookingsData.map((booking) => (
                  <div
                    key={booking._id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {booking.status || "Completed"}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Departure:</span>
                        <span>
                          {booking.goSlot?.time} ({booking.goSlot?.location})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Return:</span>
                        <span>
                          {booking.returnSlot?.time} (
                          {booking.returnSlot?.location})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => setViewBookingsFor(null)}
                variant="secondary"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentManagement;
