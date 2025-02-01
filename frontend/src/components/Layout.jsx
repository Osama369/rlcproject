import React from 'react';
import { useState , useEffect } from 'react';

const Layout = () => {
 
    // Hooks to manage states of the varaibles

    const [drawTime, setDrawTime] = useState("11 AM");
    const [drawDate, setDrawDate] = useState(new Date().toISOString().split('T')[0]);

    // this varaible will hold closingTime
    const [closingTime, setClosingTime] = useState("");

    // useeffect 
 

    useEffect(() => {
        // Calculate closing time (9 minutes before the next hour)
        const [hour, period] = drawTime.split(" ");
        let closingHour = parseInt(hour);
        let closingPeriod = period;
        if (closingHour === 12) {
          closingPeriod = period === "AM" ? "PM" : "AM";
        } else {
          closingHour = closingHour + 1;
        }
        setClosingTime(`${closingHour === 12 ? 12 : closingHour}:${"51"} ${closingPeriod}`);
      }, [drawTime]);




  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col p-5">
        <div className="text-2xl font-bold mb-6">Dealer</div>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="px-3 py-2 rounded-md hover:bg-blue-700">Book</a>
          <a href="#" className="px-3 py-2 rounded-md hover:bg-blue-700">Hisab</a>
          <a href="#" className="px-3 py-2 rounded-md hover:bg-blue-700">Voucher Inbox</a>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <header className="bg-purple-700 text-white p-4 rounded-md grid grid-cols-3 gap-4 items-center">
          <div className="flex flex-col space-y-2">
            <div className="text-lg font-semibold">Name: <input type="text" value="SOHAIL" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
            <div className="text-lg font-semibold">City: <input type="text" value="KHI" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
            <div className="text-lg font-semibold">Dealer ID: <input type="text" value="****" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
            <div className="text-lg font-semibold">Balance: <input type="text" value="34128.1" className="bg-white text-black px-2 py-1 rounded" readOnly /></div>
          </div>

          <div className="flex flex-col space-y-2">
            {/* // this is ledger drop down */}
            <div className="text-lg font-semibold">Ledger: 
              <select className="bg-white text-black px-2 py-1 rounded">
                <option>LEDGER</option>
                <option>DAILY BILL</option>
                <option>VOUCHER</option>
              </select>
            </div>
            
            <div className="text-lg font-semibold">Draw Name:
              <select className="bg-white text-black px-2 py-1 rounded" value={drawTime} onChange={(e) => setDrawTime(e.target.value)}>
                {[...Array(13)].map((_, i) => {
                  const time = `${11 + i % 12} ${i < 1 ? 'AM' : 'PM'}`;
                  return <option key={time} value={time}>{time}</option>;
                })}
              </select>
            </div>

            <div className="text-lg font-semibold">Draw Date: 
              <input type="date" className="bg-white text-black px-2 py-1 rounded" value={drawDate} onChange={(e) => setDrawDate(e.target.value)} />
            </div>

          <button className="px-2 py-2 bg-black text-white rounded-md">Print</button>
          </div> 
           {/* //this area closed here */}
           
         {/* // this is the  Time section to select of game   */}


               {/* Time Selection Section */}
<div className="mt-6 p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-4 text-black">Draw Time Selection</h2>

  {/* Time Dropdown */}
  <div className="mb-4">
    <label className="block text-lg font-semibold mb-2 text-black">Select Draw Time:</label>
    <select
      className="bg-gray-100 px-3 py-2 rounded w-full text-black"
      value={drawTime}
      onChange={(e) => setDrawTime(e.target.value)}
    >
      {[...Array(13)].map((_, i) => {
        const hour = 11 + i % 12;
        const period = i < 1 ? "AM" : "PM";
        const time = `${hour} ${period}`;
        return <option key={time} value={time}>{time}</option>;
      })}
    </select>
  </div>

  {/* Display Selected Time, Date, and Closing Time */}
  {/* <p className='text-black'><strong>Selected Draw Time:</strong> {drawTime}</p> */}
  <p className='text-black'><strong>Today Date:</strong> {new Date().toLocaleDateString()} ({new Date().toLocaleString('en-us', { weekday: 'long' })})</p>

  {/* Closing Time Calculation */}
  <p className='text-black'><strong>Closing Time:</strong> {
    (() => {
      const [hour, period] = drawTime.split(" ");
      let closingHour = parseInt(hour, 10);
      if (period === "PM" && closingHour !== 12) closingHour += 12; 
      const closingTime = new Date();
      closingTime.setHours(closingHour - 1, 51, 0); // 9 minutes before the next draw
      return closingTime.toLocaleTimeString();
    })()
  }</p>
</div>


           


        </header>
        
        {/* Body Content */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Search</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">Delete Selected</button>
            </div>
            <div className="text-gray-500 text-center py-6 border rounded-md">No Data</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">Add Sheet</button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-500">View Sheet</button>
            </div>
            <div className="text-gray-500 text-center py-6 border rounded-md">No Sheets</div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-300 rounded-md">
          <div className="flex items-center space-x-3">
            <span>Auto:</span>
            <button className="px-3 py-1 bg-gray-500 rounded hover:bg-gray-600">Off</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">On</button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Paste SMS</button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
