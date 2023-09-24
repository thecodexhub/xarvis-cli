class Health {
  constructor(
    public uptime: number,
    public message: string,
    public timestamp: string
  ) {}
}

const checkHealth = async (): Promise<Health> => {
  const uptime = process.uptime();
  const message = 'OK';

  const date = new Date();
  const timestamp = date.toString();

  return new Health(uptime, message, timestamp);
};

export { checkHealth };
