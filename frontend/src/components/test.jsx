// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { 
//   FaUser, 
//   FaClock, 
//   FaCalendarAlt, 
//   FaFileUpload, 
//   FaPrint, 
//   FaTrash, 
//   FaCheckSquare,
//   FaBook,
//   FaCalculator,
//   FaInbox,
//   FaDice,
//   FaMagic,
//   FaRing,
//   FaCog,
//   FaCheckCircle
// } from 'react-icons/fa';


// const Layout = () => {
//   // ... (keep all the existing state and logic the same)
//   //   // Hooks to manage states of the variables
// //   // State for ledger selection, date, and draw time
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();


//   const [ledger, setLedger] = useState("LEDGER");
//   const [drawTime, setDrawTime] = useState("11 AM");
//   const [drawDate, setDrawDate] = useState(new Date().toISOString().split('T')[0]);
//   const [closingTime, setClosingTime] = useState("");
//   const [entries, setEntries] = useState([]);  // table entries
//   const [no, setNo] = useState('');
//   const [f, setF] = useState('');
//   const [s, setS] = useState('');
//   const [selectAll, setSelectAll] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [file, setFile] = useState(null);
//   // State for storing permutations
//   const [permutations, setPermutations] = useState([]);  // we will set permutation in the table entreis

//  // fetch the user data

//  useEffect(() => {
//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//      // console.log(token);
      
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       // Decode token to get user ID
//       const decodedToken = JSON.parse(atob(token.split(".")[1]));
//       const userId = decodedToken.id;
//       //  console.log(userId);
       
//       const response = await axios.get(`/api/v1/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("User data received:", response.data);

//       setUser(response.data);
//     } catch (error) {
//       setError("Failed to load user data");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchUserData();
// }, [navigate]);

// useEffect(() => {
//   // Calculate closing time (9 minutes before the next hour)
//   const [hour, period] = drawTime.split(" ");
//   let closingHour = parseInt(hour);
//   let closingPeriod = period;
//   if (closingHour === 12) {
//     closingPeriod = period === "AM" ? "PM" : "AM";
//   } else {
//     closingHour = closingHour + 1;
//   }
//   setClosingTime(`${closingHour === 12 ? 12 : closingHour}:${"51"} ${closingPeriod}`);
// }, [drawTime]);

//   // Update current time every minute
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => clearInterval(interval);
//   }, []);

// if (loading) {
//   return <p className="text-center text-lg">Loading...</p>;
// }

// if (error) {
//   return <p className="text-center text-red-600">{error}</p>;
// }


//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {

//       setFile(event.target.files[0]);
//     }
//   };


//   const handleUpload = () => {
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }
//     console.log("Uploading:", file.name);
//     // Add your file upload logic here (e.g., send to a backend server)
//   };

//   // Function to generate permutations
//   const getPermutations = (str) => {
//     let results = [];
//     if (str.length === 1) return [str];

//     for (let i = 0; i < str.length; i++) {
//       const char = str[i];
//       const remainingChars = str.slice(0, i) + str.slice(i + 1);
//       const remainingPermutations = getPermutations(remainingChars);

//       for (const perm of remainingPermutations) {
//         results.push(char + perm);
//       }
//     }
//     return results;
//   };

//   // Function to get combinations of a certain length (for 4 figures Ring 24)
//   const getCombinations = (str, length) => {
//     if (length === 1) return str.split("");
//     if (length === str.length) return [str];

//     let combinations = [];
//     for (let i = 0; i < str.length; i++) {
//       let remaining = str.slice(0, i) + str.slice(i + 1);
//       let subCombinations = getCombinations(remaining, length - 1);
//       subCombinations.forEach(sub => combinations.push(str[i] + sub));
//     }
//     return combinations;
//   };

//   // Function to get all permutations of a string
//   const getPermutation = (str) => {
//     if (str.length === 1) return [str];

//     return str.split("").flatMap((char, i) =>
//       getPermutation(str.slice(0, i) + str.slice(i + 1)).map(perm => char + perm)
//     );
//   };

//   // Function to generate ordered 3-digit permutations (actual function to get permutation)
//   const generateOrderedPermutations = (num, length = 3) => {
//     let str = num.toString();
//     if (str.length !== 4) {
//       console.log("plz enter a 4 digit number");
//       return [];
//     }
//     let combinations = getCombinations(str, length);
//     let allPermutations = combinations.flatMap(getPermutation);

//     return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
//   };


//   // genarte the 5 figure ring (60)
//   const generate5DigitPermutations = (num, length = 3) => {
//     let str = num.toString();
//     if (str.length !== 5) {
//       console.log("Please enter a 5-digit number.");
//       return [];
//     }

//     let combinations = getCombinations(str, length);
//     let allPermutations = combinations.flatMap(getPermutation);

//     return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
//   };

//   // genarte the 5 digit ring (120)
//   const generate6DigitPermutations = (num, length = 3) => {
//     let str = num.toString();
//     if (str.length !== 6) {
//       console.log("Please enter a 6-digit number.");
//       return [];
//     }

//     let combinations = getCombinations(str, length);
//     let allPermutations = combinations.flatMap(getPermutation);

//     return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
//   };

//   const handle6FigureRing = () => {
//     if (no.length < 6) {
//       console.log("plz enter the ast leat 6 digits");
//       return;
//     }

//     const result = generate6DigitPermutations(no, 3);
//     console.log(result);


//     const updatedEntries = result.map((perm, index) => ({
//       id: index + 1,
//       no: perm,
//       f: f,
//       s: s,
//       selected: false,
//     }));

//     setEntries(updatedEntries);
//   }

//   const handle5FiguresRing = () => {
//     if (no.length < 5) {
//       console.log("plz enete the at least 5 digit");
//       return;
//     }

//     const result = generate5DigitPermutations(no, 3);
//     console.log(result);

//     const updatedEntries = result.map((perm, index) => ({
//       id: index + 1,
//       no: perm,
//       f: f,
//       s: s,
//       selected: false,
//     }));

//     setEntries(updatedEntries);

//   }

//   // Handle button click
//   const handle4FiguresRing = () => {
//     if (no.length < 4) {
//       console.log("Please enter at least a 4-digit number.");
//       return;
//     }
//     const result = generateOrderedPermutations(no, 3);
//     console.log("Generated Permutations:", result); // Logs result in console

//     //setPermutations(result); // Store the result in state

//     // Update entries state with new permutations
//     const updatedEntries = result.map((perm, index) => ({
//       id: index + 1,
//       no: perm,
//       f: f,
//       s: s,
//       selected: false,
//     }));


//     setEntries(updatedEntries);
//   };



//   // Handle Chakri Ring button click
//   const handleChakriRing = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       // Update entries with permutations
//       const updatedEntries = generatedPermutations.map((perm, index) => ({
//         id: index + 1,
//         no: perm,
//         f: f,  // Add relevant data
//         s: s,  // Add relevant data
//         selected: false
//       }));

//       setEntries(updatedEntries);
//       // setNo(''),
//       // setF(''),
//       // setS('')
//     }
//   };

//   // Handle Chakri Back Ring button click
//   const handleChakriRingBack = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       const updatedEntriesback = generatedPermutations.map((perm, index) => ({
//         id: index + 1,
//         no: `x${perm}`, // Ensure both are strings
//         f: f,
//         s: s,
//         selected: false
//       }));
//       setEntries(updatedEntriesback);
//       //  setNo(''),
//       //  setF(''),
//       //  setS('')
//       //  console.log(updatedEntriesback);
//       // set the fields empty
//     }
//   };

//   // Handle Chakri Ring button click
//   const handleChakriRingCross = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       const updatedEntriescross = generatedPermutations.map((perm, index) => {
//         const modifiedPerm = perm.slice(0, 1) + "x" + perm.slice(1); // Insert "x" at the second position

//         return {
//           id: index + 1,
//           no: modifiedPerm,
//           f: f,
//           s: s,
//           selected: false
//         };
//       });

//       setEntries(updatedEntriescross);
//       // setNo('');
//       // setF('');
//       // setS('');
//       // console.log(updatedEntriescross);
//     }
//   };

//   // Handle Chakri Ring with double cross button click
//   const handleChakriRingDouble = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       const updatedEntriesdouble = generatedPermutations.map((perm, index) => {
//         const modifiedPerm = perm.slice(0, 2) + "x" + perm.slice(2); // Insert "x" at the second position

//         return {
//           id: index + 1,
//           no: modifiedPerm,
//           f: f,
//           s: s,
//           selected: false
//         };
//       });

//       setEntries(updatedEntriesdouble);
//       // setNo('');
//       // setF('');
//       // setS('');
//       // console.log(updatedEntriesdouble);
//     }
//   };



//   // handleprint
//   // Function to generate downloadable PDF
//   const handleDownloadPDF = () => {
//     if (ledger !== "VOUCHER" || entries.length === 0) {
//       alert("There is nothing to download or Ledger is not set to Voucher.");
//       return;
//     }

//     const doc = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;

//     // Title and Dealer Details (Only on first page)
//     const addHeader = () => {
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(18);
//       doc.text("Voucher Sheet", pageWidth / 2, 15, { align: "center" });

//       doc.setFontSize(12);
//       doc.text(`Dealer Name: Sohail`, 14, 30);
//       doc.text(`City: Karachi`, 14, 40);
//       doc.text(`Draw Date: ${drawDate}`, 14, 50);
//       doc.text(`Draw Time: ${drawTime}`, 14, 60);
//     };

//     addHeader(); // Add header to the first page

//     let startY = 70; // Start table below details

//     doc.autoTable({
//       startY: startY,
//       head: [["Num", "F", "S"]],
//       body: entries.map(entry => [entry.no, entry.f, entry.s]),
//       theme: "grid",
//       headStyles: { fillColor: [0, 0, 255] },
//       styles: { align: "center", fontSize: 12 },
//       margin: { left: 14 },
//       didDrawPage: function (data) {
//         if (data.pageNumber > 1) {
//           addHeader(); // Add header on new pages
//           doc.setFontSize(14);
//           doc.text("Continued...", pageWidth / 2, 65, { align: "center" });
//         }
//       },
//     });

//     // Save PDF
//     doc.save("Voucher_Sheet_RLC.pdf");
//   };







//   const isPastClosingTime = (time) => {
//     const [hour, period] = time.split(" ");
//     let drawHour = parseInt(hour, 10);
//     if (period === "PM" && drawHour !== 12) drawHour += 12;
//     if (period === "AM" && drawHour === 12) drawHour = 0;

//     let closingHour = drawHour - 1;
//     if (closingHour === -1) closingHour = 23;

//     const closingTimeObj = new Date();
//     closingTimeObj.setHours(closingHour, 51, 0);

//     return currentTime >= closingTimeObj;
//   };


//   // useEffect 


//   const addEntry = () => {
//     if (no && f && s) {
//       setEntries([...entries, { id: entries.length + 1, no, f, s, selected: false }]);
//       setNo('');
//       setF('');
//       setS('');
//     }
//   };

//   const deleteSelected = () => {
//     setEntries(entries.filter(entry => !entry.selected));
//   };

//   const deleteAll = () => {
//     setEntries([]);
//   };

//   const toggleSelectAll = () => {
//     setSelectAll(!selectAll);
//     setEntries(entries.map(entry => ({ ...entry, selected: !selectAll })));
//   };

//   return (
//     <div className="flex h-screen min-h-[820px] bg-gray-900 text-gray-100 overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-800 flex flex-col p-5 border-r border-gray-700">
//         <div className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
//           <FaDice className="text-3xl" />
//           <span>Dealer Portal</span>
//         </div>
//         <nav className="flex flex-col space-y-3">
//           <a href="/" className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors">
//             <FaBook className="text-purple-400" />
//             Book
//           </a>
//           <a href="#" className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors">
//             <FaCalculator className="text-blue-400" />
//             Hisab
//           </a>
//           <a href="#" className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors">
//             <FaInbox className="text-green-400" />
//             Voucher Inbox
//           </a>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col p-6">
//         {/* Header */}
//         <div className="bg-gray-800 p-4 rounded-xl grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-6 border border-gray-700">
//           <div className="space-y-3">
//             <div className="flex items-center gap-2 text-lg">
//               <FaUser className="text-purple-400" />
//               <span className="font-semibold">Name:</span>
//               <input 
//                 type="text" 
//                 value={user.username} 
//                 className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1" 
//                 readOnly 
//               />
//             </div>
//             <div className="flex items-center gap-2 text-lg">
//               <FaUser className="text-blue-400" />
//               <span className="font-semibold">Dealer ID:</span>
//               <input 
//                 type="text" 
//                 value={user.dealerId} 
//                 className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1" 
//                 readOnly 
//               />

//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <FaClock className="text-green-400" />
//               <select 
//                 className="bg-gray-700 text-gray-100 px-3 py-2 rounded-lg border border-gray-600 flex-1"
//                 value={ledger}
//                 onChange={(e) => setLedger(e.target.value)}
//               >
//                 <option className="bg-gray-800">LEDGER</option>
//                 <option className="bg-gray-800">DAILY BILL</option>
//                 <option className="bg-gray-800">VOUCHER</option>
//               </select>
//             </div>
            
//             <div className="flex items-center gap-3">
//               <FaCalendarAlt className="text-yellow-400" />
//               <input 
//                 type="date" 
//                 className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1" 
//                 value={drawDate} 
//                 onChange={(e) => setDrawDate(e.target.value)} 
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
//               <p className="flex items-center gap-2 mb-2 text-purple-300">
//                 <FaClock className="text-lg" />
//                 <span>Closing Time:</span>
//                 <span className="font-semibold">{closingTime}</span>
//               </p>
//               <p className="flex items-center gap-2 text-blue-300">
//                 <FaCalendarAlt className="text-lg" />
//                 <span>Current Time:</span>
//                 <span className="font-semibold">
//                   {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </span>
//               </p>
//             </div>
            
//             <button 
//               onClick={handleDownloadPDF}
//               className="w-full bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
//             >
//               <FaPrint className="text-xl" />
//               Print Voucher
//             </button>
//           </div>
//         </div>

//         {/* Body Content */}
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
//           {/* Entries Table */}
//           <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex flex-col">
//             <div className="flex flex-wrap gap-3 mb-4">
//               <button 
//                 onClick={toggleSelectAll}
//                 className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2"
//               >
//                 <FaCheckSquare />
//                 {selectAll ? 'Deselect All' : 'Select All'}
//               </button>
//               <button 
//                 onClick={deleteSelected}
//                 className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
//               >
//                 <FaTrash />
//                 Delete Selected
//               </button>
//             </div>

//             <div className="border border-gray-700 rounded-lg overflow-hidden flex-1">
//               <table className="w-full border-collapse">
//                 <thead className="bg-gray-700">
//                   <tr>
//                     <th className="p-3 text-left w-12"></th>
//                     <th className="p-3 text-left">Number</th>
//                     <th className="p-3 text-left">F</th>
//                     <th className="p-3 text-left">S</th>
//                     <th className="p-3 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-700">
//                   {entries.map(entry => (
//                     <tr key={entry.id} className="hover:bg-gray-700/50 transition-colors">
//                       <td className="p-3">
//                         <input
//                           type="checkbox"
//                           checked={entry.selected}
//                           onChange={() => setEntries(entries.map(e => 
//                             e.id === entry.id ? { ...e, selected: !e.selected }  : e
//                   ))}
//                           className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
//                         />
//                       </td>
//                       <td className="p-3 font-mono text-purple-400">{entry.no}</td>
//                       <td className="p-3">{entry.f}</td>
//                       <td className="p-3">{entry.s}</td>
//                       <td className="p-3">
//                         <button className="text-blue-400 hover:text-blue-300">
//                           Edit
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Input Form */}
//             <div className="mt-4 flex gap-3">
//               <input
//                 type="text"
//                 value={no}
//                 onChange={(e) => setNo(e.target.value)}
//                 placeholder="Number"
//                 className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 flex-1 placeholder-gray-400"
//               />
//               <input
//                 type="text"
//                 value={f}
//                 onChange={(e) => setF(e.target.value)}
//                 placeholder="F"
//                 className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-20 text-center placeholder-gray-400"
//               />
//               <input
//                 type="text"
//                 value={s}
//                 onChange={(e) => setS(e.target.value)}
//                 placeholder="S"
//                 className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-20 text-center placeholder-gray-400"
//               />
//               <button 
//                 onClick={addEntry}
//                 className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2"
//               >
//                 <FaMagic />
//                 Save
//               </button>
//             </div>
//           </div>

//           {/* Actions Panel */}
//           <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Ring Actions */}
//               <div className="space-y-3">
//                 <h3 className="text-lg font-semibold mb-2 text-purple-400 flex items-center gap-2">
//                   <FaMagic />
//                   Ring Generators
//                 </h3>
//                 <button onClick={handle4FiguresRing} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg flex items-center gap-2">
//                   4 Figure Ring
//                 </button>
//                 <button onClick={handle5FiguresRing} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg flex items-center gap-2">
//                   5 Figure Ring
//                 </button>
//                 <button onClick={handle6FigureRing} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg flex items-center gap-2">
//                   6 Figure Ring
//                 </button>
//               </div>

//               {/* Special Actions */}
//               <div className="space-y-3">
//                 <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center gap-2">
//                   <FaMagic />
//                   Special Combinations
//                 </h3>
//                 <button onClick={handleChakriRing} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
//                   Chakri Ring
//                 </button>
//                 <button onClick={handleChakriRingBack} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
//                   Back Ring
//                 </button>
//                 <button onClick={handleChakriRingCross} className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg">
//                   Cross Ring
//                 </button>
//               </div>
//             </div>

//             {/* File Upload Section */}
//             <div className="mt-6 pt-4 border-t border-gray-700">
//               <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 p-3 rounded-lg cursor-pointer transition-colors">
//                 <FaFileUpload />
//                 Upload Sheet
//                 <input
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileChange}
//                 />
//               </label>
//               {file && (
//                 <p className="mt-2 text-sm text-gray-400">
//                   Selected: {file.name}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;