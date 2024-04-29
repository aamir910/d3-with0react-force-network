import React from 'react';
import '../../cssFiles/legend.css';

const LegendData = ({ uniqueClasses, uniqueClasses2 }) => {
  console.log(uniqueClasses  , uniqueClasses2)
  return (
    <>
      <div className='legend'>
        <h1 className='text-xl ml-1 font-bold'>Legend data</h1>
        <ul className='ml-1'>
          <li className='entity_1'>entity 1 class</li>
          {uniqueClasses.map((entity_1_li, index) => (
            <li key={index} >
            {entity_1_li}
            </li>
          ))}
        </ul>
        <ul>
          <li className='entity_2'>entity 2 class</li>
          {uniqueClasses2.map((entity_2_li, index) => (
            <li key={index} className='ml-6' >
            {entity_2_li}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LegendData;
