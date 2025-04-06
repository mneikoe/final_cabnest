/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { Calendar, Clock, MapPin, Bus, AlertTriangle, X } from "lucide-react";

const MyBookings = () => {
  const { currentUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");

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

      setBookings(response.data.bookings || []);
    } catch (err) {
      setError("Failed to load your bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/students/bookings/cancel/${bookingId}`,
        {},
        config
      );

      setCancelSuccess("Booking cancelled successfully");

      // Remove the cancelled booking from the state
      setBookings(bookings.filter((booking) => booking._id !== bookingId));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setCancelSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const time = new Date(`2022-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isBookingCancellable = (date) => {
    const bookingDate = new Date(date);
    const now = new Date();

    // Calculate the hours difference
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);

    // Return true if booking is more than 6 hours in future
    return hoursDiff > 6;
  };

  // Group bookings by date
  const groupedBookings = bookings.reduce((acc, booking) => {
    const date = booking.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(booking);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 md:px-8 lg:px-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your upcoming and past rides</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {cancelSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-between">
          <span>{cancelSuccess}</span>
          <button onClick={() => setCancelSuccess("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-10">
          <div className="text-gray-400 mb-4">
            <Calendar size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600 mb-4">
            You haven't booked any rides yet.
          </p>
          <a href="/" className="btn btn-primary inline-block">
            Book a Ride
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedBookings)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([date, bookingsForDate]) => (
              <div key={date} className="card">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-indigo-600" />
                    <h2 className="text-lg font-medium">{formatDate(date)}</h2>
                  </div>
                </div>

                <div className="space-y-6">
                  {bookingsForDate.map((booking) => (
                    <div
                      key={booking._id}
                      className="border-l-4 border-indigo-500 pl-4 py-1"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin size={16} className="text-indigo-600" />
                            <div className="font-medium">To College</div>
                          </div>
                          <div className="ml-6 text-gray-600">
                            Departure: {formatTime(booking.goSlot.time)}
                          </div>
                        </div>

                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Bus size={16} className="text-indigo-600" />
                            <div className="font-medium">From College</div>
                          </div>
                          <div className="ml-6 text-gray-600">
                            Departure: {formatTime(booking.returnSlot.time)}
                          </div>
                        </div>

                        {isBookingCancellable(date) && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="btn btn-danger mt-4 md:mt-0"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
