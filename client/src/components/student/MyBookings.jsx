/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  AlertTriangle,
  X,
  RotateCw,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MyBookings = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/students/bookings`,
        config
      );

      const sortedBookings = response.data.bookings.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setBookings(sortedBookings);
    } catch (err) {
      setError("Failed to load your bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/students/bookings/${bookingId}`,
        config
      );

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setCancelSuccess("Booking cancelled successfully");
      setTimeout(() => setCancelSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to cancel booking");
      setTimeout(() => setError(""), 3000);
    }
  };

  const formatDateTime = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isBookingCancellable = (bookingDateTime) => {
    const now = new Date();
    const bookingDate = new Date(bookingDateTime);
    return bookingDate - now > 60 * 60 * 1000;
  };

  const getCancellationDeadline = (bookingDateTime) => {
    const bookingDate = new Date(bookingDateTime);
    const deadline = new Date(bookingDate.getTime() - 60 * 60 * 1000);
    return deadline.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const formattedDate = formatDateTime(booking.date).toLowerCase();
    return formattedDate.includes(searchQuery.toLowerCase());
  });

  const currentBookings = filteredBookings.filter(
    (booking) =>
      new Date(booking.date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  const pastBookings = filteredBookings.filter(
    (booking) =>
      new Date(booking.date) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  const Alert = ({ message, type, onClose }) => (
    <div
      className={`p-4 rounded-lg mb-6 flex items-center justify-between border ${
        type === "error"
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "error" ? (
          <AlertTriangle size={20} />
        ) : (
          <CheckCircle size={20} />
        )}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="hover:opacity-75">
        <X size={18} />
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mb-20 py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Calendar size={28} className="text-indigo-600" />
          My Bookings
        </h1>
        <p className="text-gray-600">Manage your upcoming and past rides</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-blue-600" />
          <p className="text-sm text-blue-800">
            You can cancel bookings up to 1 hour before the scheduled ride time.
          </p>
        </div>
      </div>

      {error && (
        <Alert message={error} type="error" onClose={() => setError("")} />
      )}
      {cancelSuccess && (
        <Alert
          message={cancelSuccess}
          type="success"
          onClose={() => setCancelSuccess("")}
        />
      )}

      {loading ? (
        <div className="text-center py-12 space-y-4">
          <RotateCw className="w-8 h-8 mx-auto animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="max-w-md mx-auto">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't booked any rides yet. Start your journey with us!
            </p>
            <a
              href="/student/dashboard"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Book a Ride
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Current Bookings Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <MapPin size={20} className="text-green-600" />
              Upcoming Rides ({currentBookings.length})
            </h2>
            {currentBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-indigo-600" />
                      <span className="font-medium">
                        {formatDateTime(booking.date)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Cancel before: {getCancellationDeadline(booking.date)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-indigo-600" />
                      <span className="text-gray-700">
                        Pickup:{" "}
                        {new Date(
                          `2022-01-01T${booking.goSlot.time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-indigo-600" />
                      <span className="text-gray-700">
                        Return:{" "}
                        {new Date(
                          `2022-01-01T${booking.returnSlot.time}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    {isBookingCancellable(booking.date) ? (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel Booking
                      </button>
                    ) : (
                      <div className="text-sm text-gray-500">
                        <X size={16} className="inline mr-1" />
                        Cancellation expired
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Bookings Toggle */}
          <div className="border-t pt-6 mt-6">
            <button
              onClick={() => setShowAllBookings(!showAllBookings)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              {showAllBookings ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
              {showAllBookings ? "Hide" : "Show"} All Bookings (
              {bookings.length})
            </button>

            {showAllBookings && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left text-sm font-medium text-gray-500">
                      <th className="p-3 border-b">Date & Time</th>
                      <th className="p-3 border-b">Pickup</th>
                      <th className="p-3 border-b">Return</th>
                      <th className="p-3 border-b">Status</th>
                      <th className="p-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const isCurrent = new Date(booking.date) >= new Date();
                      return (
                        <tr key={booking._id} className="hover:bg-gray-50">
                          <td className="p-3 border-b whitespace-nowrap">
                            {formatDate(booking.date)}
                          </td>
                          <td className="p-3 border-b whitespace-nowrap">
                            {new Date(
                              `2022-01-01T${booking.goSlot.time}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3 border-b whitespace-nowrap">
                            {new Date(
                              `2022-01-01T${booking.returnSlot.time}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3 border-b whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                isCurrent
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {isCurrent ? "Upcoming" : "Completed"}
                            </span>
                          </td>
                          <td className="p-3 border-b whitespace-nowrap">
                            {isCurrent && isBookingCancellable(booking.date) ? (
                              <button
                                onClick={() => cancelBooking(booking._id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                {isCurrent ? "Non-cancellable" : "Completed"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredBookings.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No bookings match your search
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
