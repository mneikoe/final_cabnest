const { createDailySlots } = require("../utils/slotScheduler");

const autoGenerateNextDaySlotsJob = async () => {
  const today = new Date();
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const dayOfWeek = nextDay.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    console.log("Weekend - skipping auto slot creation");
    return;
  }
  const formattedDate = nextDay.toISOString().split("T")[0];
  const locations = ["Delhi"]; // Extend this array for multiple locations
  for (let location of locations) {
    await createDailySlots(location, formattedDate);
    console.log(`Slots generated for ${location} on ${formattedDate}`);
  }
};

module.exports = { autoGenerateNextDaySlotsJob };
