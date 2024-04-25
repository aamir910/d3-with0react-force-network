import React, { useState } from "react";

import * as xlsx from "xlsx"; // Import xlsx library
import ForceDirectedGraph from "./forcenetworkgrapgh";
import { Link, useNavigate } from "react-router-dom";

function UploadFile() {

  const navigate = useNavigate();
  const [jsondata , setjsondata] = useState(null) ; 
  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        console.log(json);
   setjsondata(json)
   navigate(`/force-directed-graph`, { state: { jsondata: json } });
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };
 
  return (
    <>
      <h1>Kindly upload the csv file there</h1>
      <form>
        <label htmlFor="upload">Upload File</label>
        <input
          type="file"
          name="upload"
          id="upload"
          accept=".xlsx"  
          onChange={readUploadFile}
        />
      </form>
     {/* {jsondata && (
      <>
      <Link to = '/force-directed-graph'>

      </Link>

      </>
     )
     } */}
{/* {jsondata && <ForceDirectedGraph  jsondata={jsondata}/>} */}
    </>
  );
}

export default UploadFile;
