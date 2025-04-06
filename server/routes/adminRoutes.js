const express = require("express");
const router = express.Router();
const {
  generateSlots,
  autoGenerateNextDaySlots,
  getAllSlots,
  getAllStudents,
  getBookingStats,
  updateSlot,
  deleteSlot,
  addRidesToStudent,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(protect);
router.use(admin);

router.post("/generate-slots", generateSlots);
router.post("/auto-generate-next", autoGenerateNextDaySlots);
router.get("/slots", getAllSlots);
router.get("/students", getAllStudents);
router.get("/stats", getBookingStats);
router.put("/slots/:slotId", updateSlot);
router.delete("/slots/:slotId", deleteSlot);
router.post("/students/:studentId/add-rides", addRidesToStudent);
/*router.get(
  "/bookings",
  require("../controllers/adminController").getAllBookings
);*/
router.get(
  "/students/:studentId/bookings",
  require("../controllers/adminController").getStudentBookings
);

module.exports = router;
