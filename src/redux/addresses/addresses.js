import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressData: [],
    items: [],
    addresses: { all: [], selected: "" },
    newAddress: {
      isAddingNewAddress: false,
      value: "",
    },
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setAddresses: (state, action) => {
      state.addresses = {
        ...state.addresses,
        all: action.payload,
      };
    },
    setSelectedAddress: (state, action) => {
      state.addresses.selected = action.payload;
    },
    setNewAddress: (state, action) => {
      state.newAddress.value = action.payload;
      state.newAddress.isAddingNewAddress = true;
    },
    resetNewAddress: (state) => {
      state.newAddress.value = "";
      state.newAddress.isAddingNewAddress = false;
    },
    addressInputOn: (state) => {
      state.addresses = {
        ...state.addresses,
      };
      state.newAddress.isAddingNewAddress = true;
    },
  },
});

export const getAddress = () => async (dispatch) => {
  //
  try {
    const { data } = await axios.get("/api/checkout/addresses");
    dispatch(setAddresses(data));
  } catch (e) {
    console.log(e);
  }
};

export const addNewAddress = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const addressValue = state.address.newAddress.value;
    const { data } = await axios.post("/api/checkout/addresses", {
      address: addressValue,
    });
    dispatch(setAddresses(data));
    dispatch(getAddress())
  } catch (e) {
    console.log(e);
  }
};

export const deleteAddresses = (addressId) => async (dispatch) => {
  try {
    const url = `/api/checkout/addresses/${addressId}`
    const { data } = await axios.delete(url);
    dispatch(setAddresses(data));
    dispatch(getAddress())
  } catch (error) {
    console.error("Error deleting address:", error);
  }
};

export const performFinalCheckout = (items, addresses) => () => {
  try {
      axios.post(
      "/api/finalcheckout",
      { items, addresses },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};
export const {
  setItems,
  setNewAddress,
  resetNewAddress,
  setAddresses,
  setAddressesData,
  setSelectedAddress,
  addressInputOn,
} = addressSlice.actions; 

export default addressSlice.reducer; 
