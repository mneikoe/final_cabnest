const User = require("../models/User");
const Slot = require("../models/Slot");

const bookRide = async (req, res) => {
  try {
    const { goSlotId, returnSlotId, date } = req.body;
    const studentId = req.user._id; // Get student ID from authenticated user

    const student = await User.findById(studentId);
    if (!student || student.remainingRides < 2) {
      return res.status(400).json({ message: "Not enough rides remaining" });
    }

    const goSlot = await Slot.findById(goSlotId);
    const returnSlot = await Slot.findById(returnSlotId);
    if (!goSlot || !returnSlot) {
      return res.status(404).json({ message: "Invalid slots selected" });
    }

    if (
      goSlot.students.length >= goSlot.capacity ||
      returnSlot.students.length >= returnSlot.capacity
    ) {
      return res.status(400).json({ message: "One of the slots is full" });
    }

    // Check if student already booked this slot
    if (
      goSlot.students.includes(studentId) ||
      returnSlot.students.includes(studentId)
    ) {
      return res
        .status(400)
        .json({ message: "You have already booked one of these slots" });
    }

    goSlot.students.push(studentId);
    returnSlot.students.push(studentId);
    await goSlot.save();
    await returnSlot.save();

    student.bookings.push({
      date,
      goSlot: goSlot._id,
      returnSlot: returnSlot._id,
    });
    student.remainingRides -= 2;
    await student.save();

    res.status(200).json({
      message: "Ride booked successfully",
      remainingRides: student.remainingRides,
      booking: {
        date,
        goSlot: {
          _id: goSlot._id,
          location: goSlot.location,
          time: goSlot.time,
          direction: goSlot.direction,
          date: goSlot.date,
        },
        returnSlot: {
          _id: returnSlot._id,
          location: returnSlot.location,
          time: returnSlot.time,
          direction: returnSlot.direction,
          date: returnSlot.date,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { date, direction } = req.query;
    const location = req.query.location || req.user.location;

    // Find all slots for this location and date
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);
    const slots = await Slot.find({
      location,
      direction,
      date: { $gte: startDate, $lt: endDate },
    }).select("location time direction date capacity students");

    // Add availability information
    const slotsWithAvailability = slots.map((slot) => {
      const isBooked = slot.students.includes(req.user._id);
      const availableSeats = slot.capacity - slot.students.length;

      return {
        _id: slot._id,
        location: slot.location,
        time: slot.time,
        direction: slot.direction,
        date: slot.date,
        capacity: slot.capacity,
        availableSeats,
        isBooked,
        isFull: availableSeats === 0,
      };
    });

    res.status(200).json(slotsWithAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate({
        path: "bookings.goSlot",
        select: "location time direction date",
      })
      .populate({
        path: "bookings.returnSlot",
        select: "location time direction date",
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      remainingRides: student.remainingRides,
      bookings: student.bookings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the booking in the student's bookings array
    const bookingIndex = student.bookings.findIndex(
      (b) => b._id.toString() === bookingId
    );

    if (bookingIndex === -1) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = student.bookings[bookingIndex];

    // Remove student from both slots
    await Slot.updateOne(
      { _id: booking.goSlot },
      { $pull: { students: student._id } }
    );

    await Slot.updateOne(
      { _id: booking.returnSlot },
      { $pull: { students: student._id } }
    );

    // Remove booking and refund rides
    student.bookings.splice(bookingIndex, 1);
    student.remainingRides += 2;
    await student.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      remainingRides: student.remainingRides,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { bookRide, getAvailableSlots, getMyBookings, cancelBooking };
