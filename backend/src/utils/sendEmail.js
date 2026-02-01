const { sendEmail } = require("../email/emailService");
const { renderTemplate } = require("../email/renderTemplate");

const sendConnectionRequestEmail = async ({ sender, receiver }) => {
  const html = renderTemplate("connectionRequest", {
    receiverName: receiver.firstName,
    senderName: sender.firstName,
    actionUrl: "https://codematchdate.xyz/connections",
  });

  await sendEmail({
    to: "krishnabokefod@gmail.com",
    subject: `💖 ${sender.firstName} sent you a connection request`,
    html,
    text: `${sender.firstName} sent you a connection request on CodeMatchDate`,
  });
};

const sendSignupEmail = async (user) => {
  const html = renderTemplate("signup", {
    userName: user.firstName,
    actionUrl: "https://codematchdate.xyz",
  });

  await sendEmail({
    to: "krishnabokefod@gmail",
    subject: "Welcome to CodeMatchDate 💙",
    html,
    text: `Welcome ${user.firstName} to CodeMatchDate`,
  });
};

module.exports = {
  sendConnectionRequestEmail,
  sendSignupEmail,
};
