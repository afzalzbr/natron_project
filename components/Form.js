import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import BasicDatePicker from './BasicDatePicker';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { ReadFile } from './ReadFile';

const ariaLabel = { 'aria-label': 'description' };

export default function Form() {
  const months = {
    1: 'january',
    2: 'february',
    3: 'march',
    4: 'april',
    5: 'may',
    6: 'june',
    7: 'july',
    8: 'august',
    9: 'september',
    10: 'october',
    11: 'november',
    12: 'december',
  }
  const [data, setData] = useState({});
  const [state, setState] = useState({
    date: new Date(),
    zip: '',
    isMEI: false,
    ME_IRate: 0,
    isHousing: false,
    housingRate: 0,
    milage: 0,
    jobNumber: 0,
    subtotal: 0,
    isTravelOnlyDay: false
  });

  useEffect(() => {
    console.log(data)
  }, [data])

  const onDateChange = (evt) => {
    console.log(evt)
    setState({ ...state, date: evt });
  }

  const onZipChange = (evt) => {
    let value = evt.target.value;
    setState({ ...state, zip: value })
  }

  const onZipLeave = (evt) => {

  }

  const onJobNumberChange = (evt) => {
    let value = evt.target.value;
    setState({ ...state, jobNumber: value })
  }

  const onChangeME_I = (evt) => {
    const { housingRate, milage, isMEI } = state;
    if (!isMEI) {
      let zip = state.zip;
      let objectData = data[zip];
      if (objectData) {
        let { meal_rate, incidental_rate } = objectData;
        setState({
          ...state, ME_IRate: meal_rate + incidental_rate, isMEI: !state.isMEI,
          subtotal: (housingRate) + (meal_rate + incidental_rate) + (milage * 0.57)
        })
      } else {
        setState({
          ...state, isMEI: !state.isMEI, ME_IRate: 0,
          subtotal: (housingRate) + (milage * 0.57)
        })
      }
    } else {
      setState({
        ...state, isMEI: !state.isMEI, ME_IRate: 0,
        subtotal: (housingRate) + (milage * 0.57)
      })
    }
  }

  const onChangeHousing = (evt) => {
    const { ME_IRate, milage } = state;
    if (!state.isHousing) {
      let date = new Date(state.date)
      let m = date.getMonth();
      let month = months[m];
      let zip = state.zip;
      let objectData = data[zip];
      if (objectData) {
        let housing_rate = objectData[month]
        setState({
          ...state, housingRate: housing_rate, isHousing: !state.isHousing,
          subtotal: (ME_IRate * (state.isTravelOnlyDay ? 0.75 : 1)) + housing_rate + (milage * 0.57)
        })
      } else {
        setState({
          ...state, isHousing: !state.isHousing, housingRate: 0,
          subtotal: (ME_IRate * (state.isTravelOnlyDay ? 0.75 : 1)) + (milage * 0.57)
        })
      }
    } else {
      setState({
        ...state, isHousing: !state.isHousing, housingRate: 0,
        subtotal: (ME_IRate * (state.isTravelOnlyDay ? 0.75 : 1)) + (milage * 0.57)
      })
    }
  }

  const onChangeMilage = (evt) => {
    let value = evt.target.value;
    console.log(value)
    const { ME_IRate, housingRate } = state;
    setState({ ...state, milage: value, subtotal: (ME_IRate * (state.isTravelOnlyDay ? 0.75 : 1)) + housingRate + (value * 0.57) })
  }


  const onChangeIsTravelOnlyDay = (evt) => {
    if (!state.isTravelOnlyDay) {
      const { ME_IRate, housingRate, milage } = state;
      setState({ ...state, isTravelOnlyDay: !state.isTravelOnlyDay, subtotal: (ME_IRate * 0.75) + housingRate + (milage * 0.57) })
    } else {
      setState({ ...state, isTravelOnlyDay: !state.isTravelOnlyDay })
    }
  }


  return (
    <Container maxWidth="lg" sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    >
      <ReadFile setParentData={setData} />
      {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1 },
          bgcolor: '#cfe8fc',
          width: '80%',
          paddingTop: '10%',
          display: 'flex',
          height: '100vh',
          // height: '100vh'
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={4} alignContent='center' justifyContent={'center'}>
            <BasicDatePicker
              date={state.date}
              onChange={onDateChange}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label={"Enter Zip"}
              variant="outlined"
              inputProps={ariaLabel}
              value={state.zip}
              type="number"
              onChange={onZipChange}
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              label="Job Number"
              variant="outlined"
              inputProps={ariaLabel}
              value={state.jobNumber}
              onChange={onJobNumberChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <FormControlLabel
                label="ME&I Per Diem "
                onChange={onChangeME_I}
                control={<Checkbox checked={state.isMEI} />}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Input
              disabled
              label="ME&I Rate"
              variant="outlined"
              inputProps={ariaLabel}
              value={state.ME_IRate}
            />
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <FormControlLabel
                label="Housing"
                onChange={onChangeHousing}
                control={<Checkbox checked={state.isHousing} />}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Input
              disabled
              label="Housing"
              inputProps={ariaLabel}
              variant="outlined"
              value={state.housingRate}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              label="Mileage"
              variant="outlined"
              inputProps={ariaLabel}
              value={state.milage}
              type="number"
              onChange={onChangeMilage}
            />
          </Grid>
          <Grid item xs={6}>
            <FormGroup>
              <FormControlLabel
                label="Travel Only Day"
                onChange={onChangeIsTravelOnlyDay}
                control={<Checkbox checked={state.isTravelOnlyDay} />}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <Input label="Subtotal per Day"
              inputProps={ariaLabel}
              variant="outlined"
              value={state.subtotal}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained">Submit</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
