const fs = require("fs");
const path = require("path");

const renderTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(
    __dirname,
    "templates",
    `${templateName}.html`
  );

  let html = fs.readFileSync(templatePath, "utf8");

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  });

  return html;
};

module.exports = { renderTemplate };
