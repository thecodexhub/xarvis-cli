enum AppType {
  NotSelected = 'not-selected',
  ExpressApp = 'express-app',
}

const convertStringToAppType = (argValue: string | undefined): AppType => {
  switch (argValue) {
    case 'express-app':
      return AppType.ExpressApp;
    default:
      return AppType.NotSelected;
  }
};

export { AppType, convertStringToAppType };
