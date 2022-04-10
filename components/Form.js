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

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import { EXCEL_SHEET, GOOGLE_SHEET } from './contants';

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
    email: '',
    date: new Date(),
    numberOfDays: 1,
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
  const [dates, setDates] = useState([]);
  const [values, setValues] = useState({});
  // const [objectDataResult, setObjectDataResult] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const onDateChange = (evt) => {
    console.log(evt)
    setState({ ...state, date: evt });
  }

  const onZipChange = (evt) => {
    let value = evt.target.value;
    setState({ ...state, zip: value })
  }

  const onZipLeave = (evt) => {
    let zip = evt.target.value;
    const { isMEI, isHousing } = state;
    const object = state;
    if (zip) {
      let date = new Date(state.date)
      let m = date.getMonth() + 1;
      let month = months[m];
      let objectData = data[zip];
      if (objectData) {
        let { meal_rate, incidental_rate } = objectData;
        let housing_rate = objectData[month]
        if (isMEI) {
          object.ME_IRate = meal_rate + incidental_rate
        }
        if (isHousing) {
          object.housingRate = housing_rate;
        }
        object.subtotal = (object.ME_IRate * (state.isTravelOnlyDay ? 0.75 : 1)) + object.housingRate + (object.milage * 0.57);
      }
    } else {
      object.ME_IRate = 0;
      object.housingRate = 0;
      object.subtotal = object.milage * 0.57;
    }
    setState({ ...object });
  }

  const onEmailChange = (evt) => {
    let value = evt.target.value;
    setState({ ...state, email: value })
  }

  const onJobNumberChange = (evt) => {
    let value = evt.target.value;
    setState({ ...state, jobNumber: value })
  }

  const onNumberOfDaysChange = (evt) => {
    let value = evt.target.value;
    setState({ ...state, numberOfDays: value })
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
      let m = date.getMonth() + 1;
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

  const onSubmit = () => {
    const { date, numberOfDays, email, zip, isMEI, ME_IRate, isHousing, housingRate, milage, jobNumber, subtotal, isTravelOnlyDay } = state;
    const datesNew = [];
    if (!zip) return;
    if (date && numberOfDays) {
      for (let i = 0; i < numberOfDays; i++) {
        let d = new Date(date);
        d.setDate(d.getDate() + i);
        // datesNew.push(d);
        let day = d.getDate();
        let month = d.getMonth() + 1;
        console.log(month)
        let year = d
          .getFullYear()
          .toString()
          .substr(-2);

        datesNew.push(month + '/' + day + '/' + year);
      }
    }
    setDates(datesNew);
    const objectData = data[zip];
    const dataNew = []
    const dateNewObjects = []
    datesNew.map((date, index) => {
      let d = new Date(date);
      let m = d.getMonth() + 1;
      let month = months[m];
      if (objectData) {
        let housing_rate = objectData[month];
        let object = {};
        let newObject = {};
        object.day = index + 1;
        newObject.Day = index + 1;
        newObject.Date = date;
        newObject.Email = email;
        newObject.JobNumber = jobNumber;
        newObject.Zip = zip;
        newObject.Is_MEI = isMEI ? 'true' : 'false';
        newObject.MEI_Rate = ME_IRate;
        newObject.Is_Housing = isHousing ? 'true' : 'false';
        newObject.Housing_Rate = housingRate;
        newObject.Milage = milage;
        newObject.Is_Travel = isTravelOnlyDay ? 'true' : 'false';

        object.date = date;
        object.email = email;
        object.zip = zip;
        object.jobNumber = jobNumber;
        object.isMEI = isMEI ? 'true' : 'false'
        object.ME_IRate = ME_IRate;
        object.isHousing = isHousing ? 'true' : 'false'
        object.housingRate = housing_rate;
        object.milage = milage;
        object.isTravelOnlyDay = isTravelOnlyDay ? 'true' : 'false';
        if (isTravelOnlyDay) {
          object.subtotal = (ME_IRate * 0.75) + housing_rate + (milage * 0.57)
          newObject.Subtotal = (ME_IRate * 0.75) + housing_rate + (milage * 0.57)
        } else {
          newObject.Subtotal = ME_IRate + housing_rate + (milage * 0.57)
          object.subtotal = ME_IRate + housing_rate + (milage * 0.57);
        }
        dateNewObjects.push(newObject);
        dataNew.push(Object.values(object))
      }
    })
    setValues({
      header: ['Day', 'Date', 'Email', 'Zip', 'Job Number',
        'Is ME & I', 'ME & I rate', 'is housing',
        'housing rate', 'milage',
        'is travel only day', 'subtotal'
      ], data: dataNew
    })
    setShowTable(true)
    populateGoogleSheet(dateNewObjects)
  }

  const populateGoogleSheet = (data) => {
    console.log(data)
    axios.post(GOOGLE_SHEET, data)
      .then((res) => { console.log(data) })
      .catch((err) => { console.log(err) })
  }

  // console.log(GOOGLE_SHEET)
  // console.log(EXCEL_SHEET)

  return (
    // <Container maxWidth="sm" sx={{
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   flexDirection: 'column',
    //   background: 'aqua',
    //   // height: '100vh',
    //   paddingTop: '10vh',
    //   paddingBottom: '10vh'
    // }}
    // >
    <>
      <ReadFile setParentData={setData} />
      {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}> */}
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1 },
          // bgcolor: '#cfe8fc',
          width: '100%',
          // paddingTop: '5%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          // height: '100vh'
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} maxWidth="lg">
          <Grid item sm={6} xs={12} flex justifyContent={'center'}>
            <Input
              label={"Enter Email"}
              variant="outlined"
              inputProps={ariaLabel}
              value={state.email}
              type="email"
              onChange={onEmailChange}
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={0} flex justifyContent={'center'}>

          </Grid>
          <Grid item sm={6} xs={12} alignContent='center' justifyContent={'center'}>
            <BasicDatePicker
              date={state.date}
              onChange={onDateChange}
              fullWidth
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Input
              fullWidth
              label={"Enter Zip"}
              variant="outlined"
              inputProps={ariaLabel}
              value={state.zip}
              type="number"
              onChange={onZipChange}
              onBlur={onZipLeave}
            />
          </Grid>
          <Grid item sm={6} xs={12} >
            <Input
              fullWidth
              label="Number of days"
              variant="outlined"
              inputProps={ariaLabel}
              type="number"
              value={state.numberOfDays}
              onChange={onNumberOfDaysChange}
            />
          </Grid>
          <Grid item sm={6} xs={12} >
            <Input
              fullWidth
              label="Job Number"
              variant="outlined"
              type="number"
              inputProps={ariaLabel}
              value={state.jobNumber}
              onChange={onJobNumberChange}
            />
          </Grid>
          <Grid item sm={6} xs={4} >
            <FormGroup>
              <FormControlLabel
                label="ME&I Per Diem "
                onChange={onChangeME_I}
                control={<Checkbox checked={state.isMEI} />}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={6} xs={8} >
            <Input
              fullWidth
              disabled
              label="ME&I Rate"
              variant="outlined"
              inputProps={ariaLabel}
              value={state.ME_IRate}
            />
          </Grid>
          <Grid item sm={6} xs={4} >
            <FormGroup>
              <FormControlLabel
                label="Housing"
                onChange={onChangeHousing}
                control={<Checkbox checked={state.isHousing} />}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={6} xs={8} >
            <Input
              fullWidth
              disabled
              label="Housing"
              inputProps={ariaLabel}
              variant="outlined"
              value={state.housingRate}
            />
          </Grid>
          <Grid item sm={6} xs={12} >
            <Input
              fullWidth
              label="Mileage"
              variant="outlined"
              inputProps={ariaLabel}
              value={state.milage}
              type="number"
              onChange={onChangeMilage}
            />
          </Grid>
          <Grid item sm={6} xs={12} >
            <FormGroup>
              <FormControlLabel
                label="Travel Only Day"
                onChange={onChangeIsTravelOnlyDay}
                control={<Checkbox checked={state.isTravelOnlyDay} />}
              />
            </FormGroup>
          </Grid>
          <Grid item sm={6} xs={12} >
            <Input label="Subtotal per Day"
              fullWidth
              inputProps={ariaLabel}
              variant="outlined"
              value={state.subtotal}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={onSubmit}>Submit</Button>
          </Grid>
        </Grid>
      </Box>

      {
        showTable &&
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {values.header.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {values?.data.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {row.map((cell, index) => (
                    <TableCell key={index}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      {/* </Box> */}
      {/* </Container > */}
    </>
  );
}
