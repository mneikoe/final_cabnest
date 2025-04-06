const express = require("express");
const router = express.Router();
const {
  bookRide,
  getAvailableSlots,
  getMyBookings,
  cancelBooking,
} = require("../controllers/studentController");
const { protect, student } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(protect);
router.use(student);

router.post("/book", bookRide);
router.get("/slots", getAvailableSlots);
router.get("/bookings", getMyBookings);
router.delete("/bookings/:bookingId", cancelBooking);

module.exports = router;
