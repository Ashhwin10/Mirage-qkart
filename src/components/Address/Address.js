import {
    Button,
    Stack,
    TextField,
  } from "@mui/material";
  import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setNewAddress,resetNewAddress } from "../../redux/addresses/addresses";

export const AddNewAddressView = ({
    newAddress,
    addAddress,
  }) => {
    const dispatch = useDispatch();
    return (
      <Box display="flex" flexDirection="column">
        <TextField
          data-cy="address-textbox"
          multiline
          minRows={4}
          placeholder="Enter your complete address"
          onChange={(e) => {
            dispatch(setNewAddress( e.target.value));
          }}
        />
        <Stack direction="row" my="1rem">
          <Button
            data-cy="add-new-btn"
            variant="contained"
            onClick={() => addAddress(newAddress)}
          >
            Add
          </Button>
          <Button
            variant="text"
            onClick={(e) => {
              dispatch(resetNewAddress());
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    );
  };