const {
  ADMIN_ACCESS_SECRET,
  MANAGER_ACCESS_SECRET,
  SUPERVISOR_ACCESS_SECRET,
  DRIVER_ACCESS_SECRET,
  ADMIN_REFRESH_SECRET,
  MANAGER_REFRESH_SECRET,
  SUPERVISOR_REFRESH_SECRET,
  DRIVER_REFRESH_SECRET,
} = process.env;

// Set access token secret key depending on role provided
const setAccessSecret = (role) => {
  let secret;
  switch (role) {
    case 'Admin':
      secret = ADMIN_ACCESS_SECRET;
      break;
    case 'Manager':
      secret = MANAGER_ACCESS_SECRET;
      break;
    case 'Supervisor':
      secret = SUPERVISOR_ACCESS_SECRET;
      break;
    case 'Driver':
      secret = DRIVER_ACCESS_SECRET;
      break;
    default:
      secret = DRIVER_ACCESS_SECRET;
      break;
  }
  return secret;
};
// Set refresh token secret key depending on role provided
const setRefreshSecret = (role) => {
  let secret;
  switch (role) {
    case 'Admin':
      secret = ADMIN_REFRESH_SECRET;
      break;
    case 'Manager':
      secret = MANAGER_REFRESH_SECRET;
      break;
    case 'Supervisor':
      secret = SUPERVISOR_REFRESH_SECRET;
      break;
    case 'Driver':
      secret = DRIVER_REFRESH_SECRET;
      break;
    default:
      secret = DRIVER_REFRESH_SECRET;
      break;
  }
  return secret;
};

module.exports = {
  setAccessSecret,
  setRefreshSecret,
};
