const Slot = require("../models/Slot");

const createDailySlots = async (location, date) => {
  const morningTimes = [
    "08:10",
    "08:40",
    "09:10",
    "09:40",
    "10:10",
    "10:40",
    "11:10",
    "11:40",
    "12:10",
    "12:40",
    "13:10",
  ];
  const afternoonTimes = [
    "14:10",
    "14:40",
    "15:10",
    "15:40",
    "16:10",
    "16:40",
    "17:10",
    "17:40",
    "18:10",
    "18:40",
    "19:10",
  ];

  const createSlots = async (times, direction) => {
    for (let time of times) {
      await Slot.findOneAndUpdate(
        { location, date, time, direction },
        { location, date, time, direction },
        { upsert: true, new: true }
      );
    }
  };

  await createSlots(morningTimes, "to_college");
  await createSlots(afternoonTimes, "from_college");
};

module.exports = { createDailySlots };
