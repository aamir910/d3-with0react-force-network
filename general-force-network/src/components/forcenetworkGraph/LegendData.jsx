import React from 'react';
import '../../cssFiles/legend.css';

const LegendData = ({ uniqueClasses, uniqueClasses2 ,colorScale_entity_1 ,colorScale_entity_2 ,colorScale_link , uniqueLinks }) => {

  return (
    <>
      <div className='legend'>
  <h1 className='text-xl ml-2 font-bold'>Legend data</h1>
  <ul className='ml-1'>
    <li className='entity_1 font-semibold'> Entity 1 class</li>
    {uniqueClasses.map((entity_1_li, index) => (
      <li key={index }  className='ml-6'>
         <span className="circle"  style={{
                backgroundColor: colorScale_entity_1(entity_1_li),
              }}></span> {entity_1_li}
      </li>
    ))}
  </ul>
  <ul className='ml-1' >
    <li className='entity_2 font-semibold'> Entity 2 class</li>
    {uniqueClasses2.map((entity_2_li, index) => (
      <li key={index} className='ml-6'>
        <span className="circle"  style={{
                backgroundColor: colorScale_entity_2(entity_2_li),
              }}></span> {entity_2_li}
      </li>
    ))}
  </ul>
  {/* link type  */}
  <ul className='ml-1'>
    <li className='entity_1 font-semibold'> Link Type</li>
    {uniqueLinks.map((link_type, index) => (
    
      <li key={index }  className='ml-6'>
         <span className="line"  style={{
                backgroundColor: colorScale_link(link_type),
              }}></span> {link_type}
      </li>
    ))}
  </ul>
</div>

    </>
  );
};

export default LegendData;
