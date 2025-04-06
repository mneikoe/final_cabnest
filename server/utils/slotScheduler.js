const Slot = require("../models/Slot");

const createDailySlots = async (location, date) => {
  const morningTimes = ["07:15", "08:15", "09:15", "10:15", "11:15", "12:15"];
  const afternoonTimes = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

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
