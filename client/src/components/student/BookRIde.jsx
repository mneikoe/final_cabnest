/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { Calendar, Clock, MapPin, Bus, XCircle } from "lucide-react";

const BookRide = () => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");
  const [goSlots, setGoSlots] = useState([]);
  const [returnSlots, setReturnSlots] = useState([]);
  const [selectedGoSlot, setSelectedGoSlot] = useState("");
  const [selectedReturnSlot, setSelectedReturnSlot] = useState("");

  useEffect(() => {
    const today = new Date();
    updateDateInfo(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (date) {
      fetchSlots();
      updateDateInfo(date);
    }
  }, [date]);

  const updateDateInfo = (dateStr) => {
    const d = new Date(dateStr);
    const options = { weekday: "long" };
    const weekday = new Intl.DateTimeFormat("en-US", options).format(d);
    setDayName(weekday);
    setDate(dateStr);
  };

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

      const goRes = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/students/slots?date=${date}&direction=to_college`,
        config
      );
      const returnRes = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/students/slots?date=${date}&direction=from_college`,
        config
      );

      setGoSlots(goRes.data);
      setReturnSlots(returnRes.data);
    } catch (err) {
      setError("❌ Failed to load slots. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGoSlot || !selectedReturnSlot) {
      return setError("⚠️ Please select both go and return slots.");
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/students/book`,
        {
          goSlotId: selectedGoSlot,
          returnSlotId: selectedReturnSlot,
          date: date,
        },
        config
      );

      setSuccess("🎉 Ride booked successfully!");
      setSelectedGoSlot("");
      setSelectedReturnSlot("");
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.message || "❌ Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    const time = new Date(`2022-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const DismissAlert = ({ message, type, onClose }) => (
    <div
      className={`p-4 rounded-lg mb-6 flex justify-between items-center text-sm ${
        type === "error"
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose}>
        <XCircle size={18} />
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 md:px-8 lg:px-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Ride</h1>
        <p className="text-gray-600">
          You have <strong>{currentUser.remainingRides}</strong> rides remaining
        </p>
      </div>

      {error && (
        <DismissAlert
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      {success && (
        <DismissAlert
          message={success}
          type="success"
          onClose={() => setSuccess("")}
        />
      )}

      <div className="card mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar size={20} className="text-indigo-600" />
          <h2 className="text-lg font-medium">Select Date</h2>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => updateDateInfo(e.target.value)}
          className="input mb-2"
          min={new Date().toISOString().split("T")[0]}
        />
        <div className="text-sm text-gray-600 mb-2">
          {date && `Selected: ${date} (${dayName})`}
        </div>
        <div className="text-sm text-gray-500">
          Note: Booking closes at 8:00 PM the day before
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* GO SLOTS */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin size={20} className="text-indigo-600" />
            <h2 className="text-lg font-medium">To College</h2>
          </div>
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading slots...
            </div>
          ) : goSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goSlots.map((slot) => (
                <label
                  key={slot._id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                    selectedGoSlot === slot._id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  } ${slot.isFull && "opacity-50 cursor-not-allowed"}`}
                >
                  <input
                    type="radio"
                    name="goSlot"
                    value={slot._id}
                    checked={selectedGoSlot === slot._id}
                    onChange={() => setSelectedGoSlot(slot._id)}
                    disabled={slot.isFull}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3 w-full">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Clock size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{formatTime(slot.time)}</div>
                      <div className="text-sm text-gray-500">
                        {slot.availableSeats} seats available
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No slots available for this date
            </div>
          )}
        </div>

        {/* RETURN SLOTS */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Bus size={20} className="text-indigo-600" />
            <h2 className="text-lg font-medium">From College</h2>
          </div>
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Loading slots...
            </div>
          ) : returnSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {returnSlots.map((slot) => (
                <label
                  key={slot._id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                    selectedReturnSlot === slot._id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  } ${slot.isFull && "opacity-50 cursor-not-allowed"}`}
                >
                  <input
                    type="radio"
                    name="returnSlot"
                    value={slot._id}
                    checked={selectedReturnSlot === slot._id}
                    onChange={() => setSelectedReturnSlot(slot._id)}
                    disabled={slot.isFull}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3 w-full">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Clock size={16} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{formatTime(slot.time)}</div>
                      <div className="text-sm text-gray-500">
                        {slot.availableSeats} seats available
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No slots available for this date
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              loading ||
              !selectedGoSlot ||
              !selectedReturnSlot ||
              currentUser.remainingRides <= 0
            }
            className={`rounded-full px-6 py-2 font-semibold transition-colors duration-300 
              ${
                loading ||
                !selectedGoSlot ||
                !selectedReturnSlot ||
                currentUser.remainingRides <= 0
                  ? "bg-indigo-400 text-white cursor-not-allowed opacity-60"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
          >
            {loading ? "Booking..." : "Book Ride"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookRide;
