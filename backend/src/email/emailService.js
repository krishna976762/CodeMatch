const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/awsClient");

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  const command = new SendEmailCommand({
    Source: "CodeMatchTeam@codematchdate.xyz",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
        Text: {
          Charset: "UTF-8",
          Data: text,
        },
      },
    },
  });

  return sesClient.send(command);
};

module.exports = { sendEmail };
