export default () => {
  const emailConfig = {
    service: process.env['EMAIL_SERVICE'],
    auth: {
      user: process.env['FROM_EMAIL'],
      pass: process.env['EMAIL_APP_PASSWORD'],
    },
  };
  return { emailConfig };
};
