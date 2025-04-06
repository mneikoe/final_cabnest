import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  AlertCircle,
  Loader,
  UserPlus,
  Search,
  MoreHorizontal,
  Plus,
} from "lucide-react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewBookingsFor, setViewBookingsFor] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

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
        `/api/admin/students/${studentId}/add-rides`,
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

  return (
    <div className="space-y-6 py-12 px-4 md:px-8 lg:px-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Students List</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
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
          ) : filteredStudents.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No students found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Remaining Rides</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.location || "Not specified"}
                      </TableCell>
                      <TableCell>{student.remainingRides}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedStudent(student);
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Rides
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Add Rides for {selectedStudent?.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">
                                      Rides to Add
                                    </label>
                                    <Input
                                      id="rides"
                                      defaultValue="10"
                                      type="number"
                                      min="1"
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right">
                                      Current Rides
                                    </label>
                                    <div className="col-span-3">
                                      {selectedStudent?.remainingRides || 0}
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() =>
                                        addRidesToStudent(
                                          selectedStudent?._id,
                                          document.getElementById("rides").value
                                        )
                                      }
                                    >
                                      Add Rides
                                    </Button>
                                  </DialogClose>
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
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings Dialog - placed INSIDE return before closing div */}
      {viewBookingsFor && (
        <Dialog
          open={!!viewBookingsFor}
          onOpenChange={() => setViewBookingsFor(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bookings</DialogTitle>
            </DialogHeader>

            {bookingsLoading ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : bookingsData.length === 0 ? (
              <div className="text-muted-foreground text-center py-4">
                No bookings found
              </div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                {bookingsData.map((booking, index) => (
                  <div
                    key={booking._id || index}
                    className="border rounded-md p-3 bg-muted/20"
                  >
                    <p className="font-semibold text-sm">
                      📅 {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <div className="text-sm mt-1">
                      <p>
                        🚐 <strong>Go:</strong> {booking.goSlot?.time} (
                        {booking.goSlot?.location})
                      </p>
                      <p>
                        🏁 <strong>Return:</strong> {booking.returnSlot?.time} (
                        {booking.returnSlot?.location})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentManagement;
