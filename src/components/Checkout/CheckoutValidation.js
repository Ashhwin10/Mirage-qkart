import { getTotalCartValue } from "../Cart/Cart";

export const validateRequest = (items, addresses, enqueueSnackbar) => {
  console.log("validate", "hellooo");
  if (localStorage.getItem("balance") < getTotalCartValue(items)) {
    enqueueSnackbar(
      "You do not have enough balance in your wallet for this purchase",
      { variant: "warning" }
    );
    return false;
  }

  if (!addresses.all.length) {
    enqueueSnackbar("Please add a new address before proceeding.", {
      variant: "warning",
    });
    return false;
  }

  if (!addresses.selected.length) {
    enqueueSnackbar("Please select one shipping address to proceed.", {
      variant: "warning",
    });
    return false;
  }

  return true;
};
