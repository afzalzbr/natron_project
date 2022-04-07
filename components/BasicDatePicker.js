import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

export default function BasicDatePicker({ date, onChange, fullWidth }) {
  const [value, setValue] = React.useState(date || null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        componentsProps={TextField}
        label="Date"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          onChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </LocalizationProvider>
  );
}