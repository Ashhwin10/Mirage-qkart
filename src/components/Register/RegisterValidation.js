export const validateInput = (data, enqueueSnackbar) => {
  console.log("hhhhhhhhhhhhh", data);
  if (!data.username) {
    enqueueSnackbar("Username is a required field", { variant: "warning" });
    return false;
  }
  if (data.username.length < 6) {
    enqueueSnackbar("Username must be more than 6 characters", {
      variant: "warning",
    });
    return false;
  }
  if (!data.password) {
    enqueueSnackbar("Password is a required field", { variant: "warning" });
    return false;
  }
  if (data.password.length < 6) {
    enqueueSnackbar("Password must be more than 6 characters", {
      variant: "warning",
    });
    return false;
  }
  if (data.password !== data.confirmPassword) {
    enqueueSnackbar("Passwords do not match", { variant: "warning" });
    return false;
  }
  return true;
};
