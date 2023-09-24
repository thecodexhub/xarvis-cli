const checkHealth = async () => {
  const uptime = process.uptime();
  const message = 'OK';

  const date = new Date();
  const timestamp = date.toString();

  return { uptime, message, timestamp };
};

module.exports = { checkHealth };
