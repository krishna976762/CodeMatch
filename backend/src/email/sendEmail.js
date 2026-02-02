const fs = require("fs");
const path = require("path");
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");


const loadTemplate = (fileName) => {
  return fs.readFileSync(
    path.join(__dirname, "templates", fileName),
    "utf8"
  );
};


const sendSignupEmail = async ({ userName, email }) => {
  let html = loadTemplate("signupWelcome.html");

  html = html
    .replace("{{userName}}", userName)
    .replace("{{actionUrl}}", "https://codematchdate.xyz/login");

  const command = new SendEmailCommand({
    Source: "CodeMatchTeam@codematchdate.xyz",
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "🎉 Welcome to CodeMatchDate" },
      Body: { Html: { Data: html } },
    },
  });

  return sesClient.send(command);
};


const sendConnectionRequestEmail = async ({
  senderName,
  receiverName,
  receiverEmail,
}) => {
  let html = loadTemplate("connectionRequest.html");

  html = html
    .replace("{{receiverName}}", receiverName)
    .replace("{{senderName}}", senderName)
    .replace("{{actionUrl}}", "https://codematchdate.xyz/requests");

  const command = new SendEmailCommand({
    Source: "CodeMatchTeam@codematchdate.xyz",
    Destination: { ToAddresses: [receiverEmail] },
    Message: {
      Subject: { Data: `💖 ${senderName} sent you a connection request` },
      Body: { Html: { Data: html } },
    },
  });

  return sesClient.send(command);
};


const sendConnectionReminderEmail = async ({ receiver, senders }) => {
  let html = loadTemplate("connectionReminder.html");

  const senderNames = senders
    .map((u) => `<li>${u.firstName}</li>`)
    .join("");

  html = html
    .replace("{{receiverName}}", receiver.firstName)
    .replace("{{senderList}}", senderNames)
    .replace("{{actionUrl}}", "https://codematchdate.xyz/requests");

  const command = new SendEmailCommand({
    Source: "CodeMatchTeam@codematchdate.xyz",
    Destination: { ToAddresses: [receiver.email] },
    Message: {
      Subject: { Data: "💌 You have pending connection requests" },
      Body: { Html: { Data: html } },
    },
  });

  return sesClient.send(command);
};


module.exports = {
  sendSignupEmail,
  sendConnectionRequestEmail,
  sendConnectionReminderEmail,
};
