const { get } = require("mongoose");
const Slot = require("../models/Slot");
const User = require("../models/User");
const { createDailySlots } = require("../utils/slotScheduler");
const Plan = require("../models/Plan");
const generateSlots = async (req, res) => {
  try {
    const { location, date } = req.body;
    await createDailySlots(location, date);
    res.status(200).json({ message: "Slots generated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const autoGenerateNextDaySlots = async (req, res) => {
  try {
    const { location } = req.body;
    const today = new Date();
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const dayOfWeek = nextDay.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(200).json({ message: "Weekend — no slots generated" });
    }

    const formattedDate = nextDay.toISOString().split("T")[0];
    await createDailySlots(location, formattedDate);
    res
      .status(200)
      .json({ message: `Next day (${formattedDate}) slots generated` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllSlots = async (req, res) => {
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

    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ name: 1 });

    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookingStats = async (req, res) => {
  try {
    // Get total students
    const totalStudents = await User.countDocuments({ role: "student" });

    // Get total active bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeBookingsCount = await User.aggregate([
      { $match: { role: "student" } },
      { $unwind: "$bookings" },
      { $match: { "bookings.date": { $gte: today } } },
      { $count: "total" },
    ]);

    // Get bookings by location
    const bookingsByLocation = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);

    // Get today's slots
    const todaySlots = await Slot.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    // Calculate slot utilization
    const slotUtilization =
      todaySlots.reduce((acc, slot) => {
        return acc + slot.students.length / slot.capacity;
      }, 0) / (todaySlots.length || 1);

    res.status(200).json({
      totalStudents,
      activeBookings: activeBookingsCount[0]?.total || 0,
      bookingsByLocation,
      todaySlotsCount: todaySlots.length,
      slotUtilization: (slotUtilization * 100).toFixed(2) + "%",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { capacity, time } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (capacity) slot.capacity = capacity;
    if (time) slot.time = time;

    await slot.save();
    res.status(200).json({ message: "Slot updated successfully", slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if slot has students
    if (slot.students.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete slot with bookings. Please reassign students first.",
      });
    }

    await Slot.deleteOne({ _id: slotId });
    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addRidesToStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { rides } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    student.remainingRides += parseInt(rides);
    await student.save();

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
    res.status(500).json({ error: err.message });
  }
};
// Get all students with their bookings
const getAllBookings = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email location bookings")
      .populate("bookings.goSlot bookings.returnSlot");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all bookings", error });
  }
};
// Get bookings of a specific student
const getStudentBookings = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findById(studentId)
      .select("name email location bookings")
      .populate("bookings.goSlot bookings.returnSlot");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student.bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch student bookings", error });
  }
};
const createPlan = async (req, res) => {
  try {
    const { name, rides, price, location, description } = req.body;

    if (!name || !rides || !price || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newPlan = new Plan({ name, rides, price, location, description });
    await newPlan.save();

    res.status(201).json({
      message: "Plan created successfully",
      plan: newPlan,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan" });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rides, price, location, description } = req.body;

    const updated = await Plan.findByIdAndUpdate(
      id,
      { name, rides, price, location, description },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ message: "Plan updated", plan: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Plan.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

const getPlansForStudents = async (req, res) => {
  try {
    const plans = await Plan.find()
      .sort({ price: 1 })
      .select("name rides price location description");

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching student plans:", error);
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
