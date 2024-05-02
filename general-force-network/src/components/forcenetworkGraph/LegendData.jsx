import React, { useState , useEffect } from 'react';

const Legend = ({ 
  uniqueClasses,
  uniqueClasses2,
  uniqueLinks,
  colorScale_entity_1,
  colorScale_entity_2,
  colorScale_link,
  doneItems2,
  setDoneItems2
}) => {
  const [doneItems, setDoneItems] = useState([]);
  const handleClick = (item) => {
    if (doneItems.includes(item)) {
      // If the item is already in doneItems, remove it
      setDoneItems2(doneItems.filter((doneItem) => doneItem !== item));
      
    } else {
      // If the item is not in doneItems, add it
      setDoneItems2([...doneItems, item]);
    }
  };
  // useEffect(() => {
  //   console.log(doneItems, "here are the array of items");
  // }, [doneItems]);
  
setDoneItems2('aamir change the')
  return (
    <>
      <div className='legend'>
        <h1 className='text-xl ml-2 font-bold'>Legend data</h1>
        <ul className='ml-1'>
          <li className='entity_1 font-semibold'> Entity 1 class</li>
          {uniqueClasses.map((entity_1_li, index) => (
            <li
              key={index}
              className='ml-6'
              style={{
                textDecoration: doneItems.includes(entity_1_li) ? 'line-through' : 'none'
              }}
              onClick={() => handleClick(entity_1_li)}
            >
              <span
                className="circle"
                style={{
                  backgroundColor: colorScale_entity_1(entity_1_li),
                  display: 'inline-block', // Add this style
                  width: '10px', // Add this style
                  height: '10px', // Add this style
                  borderRadius: '50%', // Add this style
                  marginRight: '5px' // Add this style
                }}
              ></span>
              {entity_1_li}
            </li>
          ))}
        </ul>
        <ul className='ml-1' >
          <li className='entity_2 font-semibold'> Entity 2 class</li>
          {uniqueClasses2.map((entity_2_li, index) => (
            <li
              key={index}
              className='ml-6'
              style={{
                textDecoration: doneItems.includes(entity_2_li) ? 'line-through' : 'none'
              }}
              onClick={() => handleClick(entity_2_li)}
            >
              <span
                className="circle"
                style={{
                  backgroundColor: colorScale_entity_2(entity_2_li),
                  display: 'inline-block', // Add this style
                  width: '10px', // Add this style
                  height: '10px', // Add this style
                  borderRadius: '50%', // Add this style
                  marginRight: '5px' // Add this style
                }}
              ></span>
              {entity_2_li}
            </li>
          ))}
        </ul>
        {/* link type  */}
        <ul className='ml-1'>
          <li className='entity_1 font-semibold'> Link Type</li>
          {uniqueLinks.map((link_type, index) => (
            <li
              key={index}
              className='ml-6'
              style={{
                textDecoration: doneItems.includes(link_type) ? 'line-through' : 'none'
              }}
              onClick={() => handleClick(link_type)}
            >
              <span
                className="line"
                style={{
                  backgroundColor: colorScale_link(link_type),
                  display: 'inline-block', // Add this style
                  width: '10px', // Add this style
                  height: '2px' // Add this style
                }}
              ></span>
              {link_type}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Legend;
