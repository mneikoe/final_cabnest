const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const {
  bookRide,
  getAvailableSlots,
  getMyBookings,
  cancelBooking,
} = require("../controllers/studentController");
const { protect, student } = require("../middleware/auth");
const { getPlansForStudents } = require("../controllers/adminController");

router.use(protect);
router.use(student);

router.post("/book", bookRide);
router.get("/slots", getAvailableSlots);
router.get("/bookings", getMyBookings);
router.delete("/bookings/:bookingId", cancelBooking);
router.get("/subs-plans", getPlansForStudents);
router.get("/subs-plans/:planId", protect, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
