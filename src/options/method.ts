enum Method {
  NotSelected = 'not-selected',
  Create = 'create',
}

const convertStringToMethod = (argValue: string | undefined): Method => {
  switch (argValue) {
    case 'create':
      return Method.Create;
    default:
      return Method.NotSelected;
  }
};

export { Method, convertStringToMethod };
