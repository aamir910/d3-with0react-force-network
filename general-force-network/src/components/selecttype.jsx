import React, { useState } from 'react';
import forceimage from '../images/selecttype/forcenetwork.png';
import { Link } from 'react-router-dom';

function SelectType() {
  const [showButton, setShowButton] = useState(false);

  const handleButtonClick = () => {
    // Simulate downloading XLXS file
    const data = "example data"; // Replace this with your actual data
    const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example.xlsx'; // Change the filename as needed
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <h1>select the type</h1>
      {showButton ? (
        <>
          <Link to='/force-directed-graph'>
            <img src={forceimage} alt="" />
            <p>force network diagram</p>
          </Link>
          <button onClick={handleButtonClick}>Download simple XLXS</button>
        </>
      ) : (
        <div onClick={() => setShowButton(true)}>
          <img src={forceimage} alt="" />
          <p>force network diagram</p>
        </div>
      )}
    </>
  );
}

export default SelectType;
