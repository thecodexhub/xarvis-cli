enum Template {
  NotSelected = "not-selected",
  JavaScript = "javascript",
  TypeScript = "typescript",
}

const convertStringToTemplate = (argValue: string | undefined): Template => {
  switch (argValue) {
    case "javascript":
      return Template.JavaScript;
    case "typescript":
      return Template.TypeScript;
    default:
      return Template.NotSelected;
  }
};

export { Template, convertStringToTemplate };
