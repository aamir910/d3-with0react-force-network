
import React, { useState } from 'react';
// import XLSX from 'xlsx';
function UploadFile() {

  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setJsonData(data);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h1>Kindly upload the csv file there</h1>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      <div>
          <h3>JSON Data:</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
    </div>
  )
}

export default UploadFile
