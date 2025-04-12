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
  getStudentBookings,
  // 🆕 Plan controllers
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
} = require("../controllers/adminController");

const { protect, admin } = require("../middleware/auth");

// 🔐 Apply authentication middleware globally
router.use(protect);
router.use(admin);

// 🔁 Ride slot related
router.post("/generate-slots", generateSlots);
router.post("/auto-generate-next", autoGenerateNextDaySlots);
router.get("/slots", getAllSlots);
router.put("/slots/:slotId", updateSlot);
router.delete("/slots/:slotId", deleteSlot);

// 👥 Student related
router.get("/students", getAllStudents);
router.post("/students/:studentId/add-rides", addRidesToStudent);
router.get("/students/:studentId/bookings", getStudentBookings);

// 📊 Stats
router.get("/stats", getBookingStats);

// 🆕 📦 Plans CRUD (Protected by admin)
router.post("/plans-create", createPlan); // Create
router.get("/plans", getAllPlans); // Read all
router.put("/plans/:id", updatePlan); // Update
router.delete("/plans/:id", deletePlan); // Delete

module.exports = router;
