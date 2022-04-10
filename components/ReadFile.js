import React, { useEffect, useState } from 'react'
import * as XLSX from "xlsx";
import { EXCEL_SHEET } from './contants';
// import raw from './data.xlsx';

export const ReadFile = ({ setParentData }) => {
  const [data, setData] = useState({});
  const onChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    // const file = new File([], './test.xlsx');
    const reader = new FileReader();

    reader.onload = (evt) => {
      console.log(evt)
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      console.log(data);
    };
    reader.readAsBinaryString(file);
  };

  const test = () => {
    fetch(EXCEL_SHEET)
      .then(r => r.blob())
      .then((blob) => {
        let file = new File([blob], './test.xlsx');
        // console.log(file);
        const reader = new FileReader();

        reader.onload = (evt) => {
          // console.log(evt)
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
          const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
          // console.log(json);
          let newData = {};
          json.forEach((item) => {
            let zip = item[0];
            let obj = {}
            obj.state = item[1];
            obj.county = item[2]
            obj.city = item[3]
            obj.fiscal_year = item[4]
            obj.october = item[5]
            obj.november = item[6]
            obj.december = item[7]
            obj.january = item[8]
            obj.february = item[9]
            obj.march = item[10]
            obj.april = item[11]
            obj.may = item[12]
            obj.june = item[13]
            obj.july = item[14]
            obj.august = item[15]
            obj.september = item[16]
            obj.meal_rate = item[17]
            obj.incidental_rate = item[18]
            obj.proportional_meal_rate = item[19]
            newData[zip] = obj;
          })
          setData(newData);
          setParentData(newData);
          // console.log(json);
        };
        reader.readAsBinaryString(file);
      });
  }

  useEffect(() => {
    test();
  }, [])

  return (
    <div>
      {/* <input type='file' onChange={onChange} /> */}
    </div >
  )
}
