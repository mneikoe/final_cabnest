const User = require("../models/User");
const Slot = require("../models/Slot");
const logger = require("../utils/logger");

// Book Ride
const bookRide = async (req, res) => {
  logger.info(
    "Booking request by user %s for date %s",
    req.user._id,
    req.body.date
  );
  try {
    const { goSlotId, returnSlotId, date } = req.body;
    const studentId = req.user._id;

    const student = await User.findById(studentId);
    if (!student) {
      logger.warn("Booking failed - student not found: %s", studentId);
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.remainingRides < 2) {
      logger.warn(
        "Booking failed - not enough rides for student: %s",
        studentId
      );
      return res.status(400).json({ message: "Not enough rides remaining" });
    }

    const goSlot = await Slot.findById(goSlotId);
    const returnSlot = await Slot.findById(returnSlotId);

    if (!goSlot || !returnSlot) {
      logger.warn(
        "Booking failed - invalid slot IDs: %s %s",
        goSlotId,
        returnSlotId
      );
      return res.status(404).json({ message: "Invalid slots selected" });
    }

    if (
      goSlot.students.length >= goSlot.capacity ||
      returnSlot.students.length >= returnSlot.capacity
    ) {
      logger.warn("Booking failed - one of the slots full on date %s", date);
      return res.status(400).json({ message: "One of the slots is full" });
    }

    if (
      goSlot.students.includes(studentId) ||
      returnSlot.students.includes(studentId)
    ) {
      logger.warn("Booking failed - user %s already booked a slot", studentId);
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

    logger.info("Booking successful for user %s", studentId);

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
    logger.error("Booking error: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

// Get Available Slots
const getAvailableSlots = async (req, res) => {
  logger.info(
    "Getting available slots for user %s with query %o",
    req.user._id,
    req.query
  );
  try {
    const { date, direction } = req.query;
    const location = req.query.location || req.user.location;

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    const slots = await Slot.find({
      location,
      direction,
      date: { $gte: startDate, $lt: endDate },
    }).select("location time direction date capacity students");

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

    logger.info(
      "Available slots count: %d for user %s",
      slots.length,
      req.user._id
    );

    res.status(200).json(slotsWithAvailability);
  } catch (err) {
    logger.error("Get slots error: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

// Get My Bookings
const getMyBookings = async (req, res) => {
  logger.info("Getting bookings for user %s", req.user._id);
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
      logger.warn("Get bookings failed - student not found: %s", req.user._id);
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      remainingRides: student.remainingRides,
      bookings: student.bookings,
    });
  } catch (err) {
    logger.error("Get bookings error: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  logger.info(
    "Cancel booking request %s by user %s",
    req.params.bookingId,
    req.user._id
  );
  try {
    const { bookingId } = req.params;
    const student = await User.findById(req.user._id);

    if (!student) {
      logger.warn(
        "Cancel booking failed - student not found: %s",
        req.user._id
      );
      return res.status(404).json({ message: "Student not found" });
    }

    const bookingIndex = student.bookings.findIndex(
      (b) => b._id.toString() === bookingId
    );

    if (bookingIndex === -1) {
      logger.warn("Cancel booking failed - booking not found: %s", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = student.bookings[bookingIndex];

    await Slot.updateOne(
      { _id: booking.goSlot },
      { $pull: { students: student._id } }
    );

    await Slot.updateOne(
      { _id: booking.returnSlot },
      { $pull: { students: student._id } }
    );

    student.bookings.splice(bookingIndex, 1);
    student.remainingRides += 2;
    await student.save();

    logger.info(
      "Booking cancelled successfully: %s by user %s",
      bookingId,
      req.user._id
    );

    res.status(200).json({
      message: "Booking cancelled successfully",
      remainingRides: student.remainingRides,
    });
  } catch (err) {
    logger.error("Cancel booking error: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { bookRide, getAvailableSlots, getMyBookings, cancelBooking };
