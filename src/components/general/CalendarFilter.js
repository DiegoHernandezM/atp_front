import { useState } from "react";
import esLocale from "date-fns/locale/es";
import { Box, FormControl, TextField } from "@mui/material";
import "moment/locale/es";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";


export default function CalendarFilter({ parentCallback }) {
  const [startDate, setStarDate] = useState(new Date());

  return (
    <>
      <Box sx={{ mt: 3, mx: 3 }} dir="ltr" style={{ textAlign: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
          <FormControl style={{ margin: "10px", width: "180px" }}>
            <DatePicker
              views={["year"]}
              maxDate={new Date()}
              minDate={new Date()}
              label="Selecciona un año"
              value={startDate}
              onChange={(value) => {
                setStarDate(value);
                parentCallback(value);
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </FormControl>
        </LocalizationProvider>
      </Box>
    </>
  );
}
