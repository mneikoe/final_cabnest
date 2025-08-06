const { get } = require("mongoose");
const Slot = require("../models/Slot");
const User = require("../models/User");
const { createDailySlots } = require("../utils/slotScheduler");
const Plan = require("../models/Plan");
const logger = require("../utils/logger"); // Winston logger utility

const generateSlots = async (req, res) => {
  logger.info("generateSlots called with body: %o", req.body);
  try {
    const { location, date } = req.body;
    await createDailySlots(location, date);
    logger.info(
      "Slots generated successfully for location '%s' on date '%s'",
      location,
      date
    );
    res.status(200).json({ message: "Slots generated successfully" });
  } catch (err) {
    logger.error("Error in generateSlots: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const autoGenerateNextDaySlots = async (req, res) => {
  logger.info("autoGenerateNextDaySlots called with body: %o", req.body);
  try {
    const { location } = req.body;
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const dayOfWeek = nextDay.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      logger.info(
        "Weekend detected (day %d), no slots generated for location '%s'",
        dayOfWeek,
        location
      );
      return res.status(200).json({ message: "Weekend — no slots generated" });
    }

    const formattedDate = nextDay.toISOString().split("T")[0];
    await createDailySlots(location, formattedDate);
    logger.info(
      "Next day (%s) slots generated for location %s",
      formattedDate,
      location
    );

    res
      .status(200)
      .json({ message: `Next day (${formattedDate}) slots generated` });
  } catch (err) {
    logger.error("Error in autoGenerateNextDaySlots: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const getAllSlots = async (req, res) => {
  logger.info("getAllSlots called with query: %o", req.query);
  try {
    const { date, location, direction } = req.query;

    const query = {};
    if (date) query.date = date;
    if (location) query.location = location;
    if (direction) query.direction = direction;

    const slots = await Slot.find(query).sort({ date: 1, time: 1 }).populate({
      path: "students",
      select: "name email location",
    });

    logger.info("Fetched %d slots matching query", slots.length);
    res.status(200).json(slots);
  } catch (err) {
    logger.error("Error in getAllSlots: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const getAllStudents = async (req, res) => {
  logger.info("getAllStudents called");
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ name: 1 });
    logger.info("Fetched %d students", students.length);
    res.status(200).json(students);
  } catch (err) {
    logger.error("Error in getAllStudents: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const getBookingStats = async (req, res) => {
  logger.info("getBookingStats called");
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookingsCount = await User.aggregate([
      { $match: { role: "student" } },
      { $unwind: "$bookings" },
      { $match: { "bookings.date": { $gte: today } } },
      { $count: "total" },
    ]);

    const bookingsByLocation = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);

    const todaySlots = await Slot.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const slotUtilization =
      todaySlots.reduce(
        (acc, slot) => acc + slot.students.length / slot.capacity,
        0
      ) / (todaySlots.length || 1);

    logger.info(
      "Booking stats computed: totalStudents=%d, activeBookings=%d, slotsToday=%d",
      totalStudents,
      activeBookingsCount[0]?.total || 0,
      todaySlots.length
    );

    res.status(200).json({
      totalStudents,
      activeBookings: activeBookingsCount[0]?.total || 0,
      bookingsByLocation,
      todaySlotsCount: todaySlots.length,
      slotUtilization: (slotUtilization * 100).toFixed(2) + "%",
    });
  } catch (err) {
    logger.error("Error in getBookingStats: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const updateSlot = async (req, res) => {
  logger.info(
    "updateSlot called with slotId=%s and body=%o",
    req.params.slotId,
    req.body
  );
  try {
    const { slotId } = req.params;
    const { capacity, time } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      logger.warn("Slot not found with id=%s", slotId);
      return res.status(404).json({ message: "Slot not found" });
    }

    if (capacity) slot.capacity = capacity;
    if (time) slot.time = time;

    await slot.save();
    logger.info("Slot %s updated successfully", slotId);

    res.status(200).json({ message: "Slot updated successfully", slot });
  } catch (err) {
    logger.error("Error in updateSlot: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const deleteSlot = async (req, res) => {
  logger.info("deleteSlot called with slotId=%s", req.params.slotId);
  try {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      logger.warn("Slot not found to delete with id=%s", slotId);
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.students.length > 0) {
      logger.warn("Slot %s has students booked, cannot delete", slotId);
      return res.status(400).json({
        message:
          "Cannot delete slot with bookings. Please reassign students first.",
      });
    }

    await Slot.deleteOne({ _id: slotId });
    logger.info("Slot %s deleted successfully", slotId);

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (err) {
    logger.error("Error in deleteSlot: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const addRidesToStudent = async (req, res) => {
  logger.info(
    "addRidesToStudent called with studentId=%s and rides=%o",
    req.params.studentId,
    req.body.rides
  );
  try {
    const { studentId } = req.params;
    const { rides } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      logger.warn("Student not found or invalid role with id=%s", studentId);
      return res.status(404).json({ message: "Student not found" });
    }

    student.remainingRides += parseInt(rides);
    await student.save();

    logger.info(
      "Added %d rides to student %s, now has %d rides",
      rides,
      studentId,
      student.remainingRides
    );

    res.status(200).json({
      message: `Added ${rides} rides to ${student.name}`,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        remainingRides: student.remainingRides,
      },
    });
  } catch (err) {
    logger.error("Error in addRidesToStudent: %s", err.stack);
    res.status(500).json({ error: err.message });
  }
};

const getAllBookings = async (req, res) => {
  logger.info("getAllBookings called");
  try {
    const students = await User.find({ role: "student" })
      .select("name email location bookings")
      .populate("bookings.goSlot bookings.returnSlot");

    logger.info("Fetched bookings for %d students", students.length);
    res.status(200).json(students);
  } catch (error) {
    logger.error("Error in getAllBookings: %s", error.stack);
    res.status(500).json({ message: "Failed to fetch all bookings", error });
  }
};

const getStudentBookings = async (req, res) => {
  logger.info(
    "getStudentBookings called for studentId=%s",
    req.params.studentId
  );
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId)
      .select("name email location bookings")
      .populate("bookings.goSlot bookings.returnSlot");

    if (!student) {
      logger.warn("Student not found with id=%s", studentId);
      return res.status(404).json({ message: "Student not found" });
    }

    logger.info(
      "Fetched bookings for studentId=%s, %d bookings",
      studentId,
      student.bookings.length
    );
    res.status(200).json(student.bookings);
  } catch (error) {
    logger.error("Error in getStudentBookings: %s", error.stack);
    res
      .status(500)
      .json({ message: "Failed to fetch student bookings", error });
  }
};

const createPlan = async (req, res) => {
  logger.info("createPlan called with body: %o", req.body);
  try {
    const { name, rides, price, location, description } = req.body;

    if (!name || !rides || !price || !location || !description) {
      logger.warn("Create plan failed due to missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPlan = new Plan({ name, rides, price, location, description });
    await newPlan.save();

    logger.info("Plan created successfully with id %s", newPlan._id);
    res.status(201).json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    logger.error("Error creating plan: %s", error.stack);
    res.status(500).json({ message: "Failed to create plan" });
  }
};

const getAllPlans = async (req, res) => {
  logger.info("getAllPlans called");
  try {
    const plans = await Plan.find();
    logger.info("Fetched %d plans", plans.length);
    res.status(200).json(plans);
  } catch (err) {
    logger.error("Error in getAllPlans: %s", err.stack);
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

const updatePlan = async (req, res) => {
  logger.info(
    "updatePlan called with id %s and body: %o",
    req.params.id,
    req.body
  );
  try {
    const { id } = req.params;
    const { name, rides, price, location, description } = req.body;

    const updated = await Plan.findByIdAndUpdate(
      id,
      { name, rides, price, location, description },
      { new: true, runValidators: true }
    );

    if (!updated) {
      logger.warn("Update plan failed - plan not found: %s", id);
      return res.status(404).json({ message: "Plan not found" });
    }

    logger.info("Plan %s updated successfully", id);
    res.status(200).json({ message: "Plan updated", plan: updated });
  } catch (err) {
    logger.error("Error in updatePlan: %s", err.stack);
    res.status(500).json({ message: "Update failed" });
  }
};

const deletePlan = async (req, res) => {
  logger.info("deletePlan called with id %s", req.params.id);
  try {
    const { id } = req.params;
    const deleted = await Plan.findByIdAndDelete(id);

    if (!deleted) {
      logger.warn("Delete plan failed - plan not found: %s", id);
      return res.status(404).json({ message: "Plan not found" });
    }

    logger.info("Plan %s deleted successfully", id);
    res.status(200).json({ message: "Plan deleted" });
  } catch (err) {
    logger.error("Error in deletePlan: %s", err.stack);
    res.status(500).json({ message: "Delete failed" });
  }
};

const getPlansForStudents = async (req, res) => {
  logger.info("getPlansForStudents called");
  try {
    const plans = await Plan.find()
      .sort({ price: 1 })
      .select("name rides price location description");

    logger.info("Fetched %d plans for students", plans.length);
    res.status(200).json(plans);
  } catch (error) {
    logger.error("Error in getPlansForStudents: %s", error.stack);
    res.status(500).json({ message: "Failed to fetch plans for students." });
  }
};

module.exports = {
  generateSlots,
  autoGenerateNextDaySlots,
  getAllSlots,
  getAllStudents,
  getBookingStats,
  updateSlot,
  deleteSlot,
  addRidesToStudent,
  getAllBookings,
  getStudentBookings,
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
  getPlansForStudents,
};
