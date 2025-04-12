import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { Calendar, Clock, MapPin, Bus, XCircle, Loader2 } from "lucide-react";

const BookRide = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");
  const [goSlots, setGoSlots] = useState([]);
  const [returnSlots, setReturnSlots] = useState([]);
  const [selectedGoSlot, setSelectedGoSlot] = useState("");
  const [selectedReturnSlot, setSelectedReturnSlot] = useState("");
  const navigate = useNavigate();
  const getLocalDateString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    return today.toISOString().split("T")[0];
  };
  useEffect(() => {
    const getLocalDateString = () => {
      const today = new Date();
      const offset = today.getTimezoneOffset();
      today.setMinutes(today.getMinutes() - offset);
      return today.toISOString().split("T")[0];
    };

    const todayLocal = getLocalDateString();
    updateDateInfo(todayLocal);
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

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/students/book`,
        {
          goSlotId: selectedGoSlot,
          returnSlotId: selectedReturnSlot,
          date: date,
        },
        config
      );
      if (response.data.user) {
        setCurrentUser(response.data.user); // Update user context
      }

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

  const PopupAlert = ({ message, type, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`p-6 rounded-xl max-w-md w-full flex items-center justify-between text-lg ${
          type === "error"
            ? "bg-red-50 border-2 border-red-200 text-red-700"
            : "bg-green-50 border-2 border-green-200 text-green-700"
        }`}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="hover:opacity-75 transition-opacity ml-4"
        >
          <XCircle size={24} />
        </button>
      </div>
    </div>
  );

  const SlotLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-16 bg-gray-100 rounded-lg"></div>
      <div className="h-16 bg-gray-100 rounded-lg"></div>
      <div className="h-16 bg-gray-100 rounded-lg"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mb-30 px-4 md:px-8 lg:px-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Book a Ride
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {currentUser.remainingRides} rides remaining
              </span>
              {currentUser.remainingRides === 0 && (
                <span className="text-sm text-red-600">
                  (Please purchase a plan)
                </span>
              )}
            </p>
          </div>

          {currentUser.remainingRides === 0 && (
            <button
              onClick={() => navigate("/student/plans")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full md:w-auto"
            >
              Buy Ride Plan
            </button>
          )}
        </div>

        {error && (
          <PopupAlert
            message={error}
            type="error"
            onClose={() => setError("")}
          />
        )}
        {success && (
          <PopupAlert
            message={success}
            type="success"
            onClose={() => setSuccess("")}
          />
        )}
      </div>

      {/* Date Selection Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Select Travel Date
            </h2>
            <p className="text-sm text-gray-500">
              Bookings close at 8:00 PM the day before
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => updateDateInfo(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            min={getLocalDateString()} // Add this function
          />
          {date && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                Selected:{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* To College Slots */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MapPin size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Morning Pickup
            </h2>
          </div>

          {loading ? (
            <SlotLoader />
          ) : goSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {goSlots.map((slot) => (
                <label
                  key={slot._id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[80px] flex flex-col justify-between
                  ${
                    selectedGoSlot === slot._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }
                  ${slot.isFull ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="goSlots"
                    value={slot._id}
                    checked={selectedGoSlot === slot._id}
                    onChange={() => !slot.isFull && setSelectedGoSlot(slot._id)}
                    className="hidden"
                    disabled={slot.isFull}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-900">
                          {formatTime(slot.time)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        {slot.availableSeats} Seats Left
                      </div>
                    </div>
                    {slot.isFull && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2 shrink-0">
                        Fully Booked
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No available pickup slots for this date
              </p>
            </div>
          )}
        </div>

        {/* From College Slots */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Bus size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Evening Return
            </h2>
          </div>

          {loading ? (
            <SlotLoader />
          ) : returnSlots.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {returnSlots.map((slot) => (
                <label
                  key={slot._id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[80px] flex flex-col justify-between
                 ${
                   selectedGoSlot === slot._id
                     ? "border-blue-500 bg-blue-50"
                     : "border-gray-200 hover:border-blue-300"
                 }
                 ${slot.isFull ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="returnSlots"
                    value={slot._id}
                    checked={selectedReturnSlot === slot._id}
                    onChange={() =>
                      !slot.isFull && setSelectedReturnSlot(slot._id)
                    }
                    className="hidden"
                    disabled={slot.isFull}
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-900">
                          {formatTime(slot.time)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 whitespace-nowrap">
                        {slot.availableSeats} Seats Left
                      </div>
                    </div>
                    {slot.isFull && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2 shrink-0">
                        Fully Booked
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No available return slots for this date
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={
              loading ||
              !selectedGoSlot ||
              !selectedReturnSlot ||
              currentUser.remainingRides <= 0
            }
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
              ${
                loading ||
                !selectedGoSlot ||
                !selectedReturnSlot ||
                currentUser.remainingRides <= 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              }`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookRide;
