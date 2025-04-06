/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { Calendar, Clock, Users, MapPin, ArrowDown } from "lucide-react";

const AvailableSlots = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState({
    toCollege: [],
    fromCollege: [],
  });

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setDate(formattedDate);
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (date) {
      fetchSlots();
    }
  }, [date]);

  const fetchSlots = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Get all slots for the selected date
      const response = await axios.get(
        `${
          import.meta.env.REACT_APP_API_URL
        }/api/students/all-slots?date=${date}`,
        config
      );

      setSlots({
        toCollege: response.data.filter(
          (slot) => slot.direction === "to-college"
        ),
        fromCollege: response.data.filter(
          (slot) => slot.direction === "from-college"
        ),
      });
    } catch (err) {
      setError("Failed to load available slots");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const time = new Date(`2022-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Available Transport Slots
        </h1>
        <p className="text-gray-600">
          View all available transport slots for any date
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar size={20} className="text-indigo-600" />
          <h2 className="text-lg font-medium">Select Date</h2>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading slots...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin size={20} className="text-indigo-600" />
              <h2 className="text-lg font-medium">To College</h2>
            </div>

            {slots.toCollege.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Starting Point
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Seats
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slots.toCollege.map((slot) => (
                      <tr key={slot._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatTime(slot.time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.startingPoint}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              slot.availableSeats > 5
                                ? "bg-green-100 text-green-800"
                                : slot.availableSeats > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slot.availableSeats}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No slots available for this date
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <ArrowDown size={20} className="text-indigo-600" />
              <h2 className="text-lg font-medium">From College</h2>
            </div>

            {slots.fromCollege.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Seats
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {slots.fromCollege.map((slot) => (
                      <tr key={slot._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatTime(slot.time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {slot.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              slot.availableSeats > 5
                                ? "bg-green-100 text-green-800"
                                : slot.availableSeats > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slot.availableSeats}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No slots available for this date
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableSlots;
