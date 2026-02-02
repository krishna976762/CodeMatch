const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");

const ConnectionRequest = require("../models/ConnectionRequest");
const sendEmail = require("../email/sendEmail");

// this job will run everyday 8AM in morning
cron.schedule("0 8 * * *", async () => {
  try {
    console.log("📩 Running connection reminder cron...");

    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    // Get yesterday's pending requests
    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

   
    const requestsByUser = {};

    for (const req of pendingRequests) {
      const receiverEmail = req.toUserId?.email;
      if (!receiverEmail) continue;

      if (!requestsByUser[receiverEmail]) {
        requestsByUser[receiverEmail] = {
          receiver: req.toUserId,
          senders: [],
        };
      }

      requestsByUser[receiverEmail].senders.push(req.fromUserId);
    }

    // Send reminder emails
    for (const email in requestsByUser) {
      const { receiver, senders } = requestsByUser[email];

      try {
        await sendEmail.sendConnectionReminderEmail({
          receiver,
          senders,
        });

        console.log(`✅ Reminder sent to ${email}`);
      } catch (err) {
        console.error(`❌ Failed for ${email}`, err.message);
      }
    }
  } catch (error) {
    console.error("❌ Cron failed:", error.message);
  }
});
