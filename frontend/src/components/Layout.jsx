import { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import axios from "axios";
import jsPDF from "jspdf";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';
// imort the FaSignOutAlt
import { FaSignOutAlt } from 'react-icons/fa';
// import { setData } from '../redux/features/dataSlice';
import { toast } from "react-toastify";
import Center from './Center';
import Spinner from '../components/Spinner'
import "jspdf-autotable";
import {
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaFileUpload,
  FaPrint,
  FaTrash,
  FaCheckSquare,
  FaBook,
  FaCalculator,
  FaInbox,
  FaDice,
  FaMagic,
  FaCity,
  FaBalanceScale,
  FaUserTie,
  FaRing,
  FaCog,
  FaCheckCircle,
  FaArrowUp,
  FaEye,
  FaStar, FaMoon,

} from 'react-icons/fa';
const Layout = () => {
  // Hooks to manage states of the variables
  // State for ledger selection, date, and draw time
  //const [user, setUser] = useState(null);
  // using the redux slice reducer

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const token = userData?.token || localStorage.getItem("token");
  // console.log(token);


  const [ledger, setLedger] = useState("LEDGER");
  const [drawTime, setDrawTime] = useState("11 AM");  // time slot
  const [drawDate, setDrawDate] = useState(new Date().toISOString().split('T')[0]); // date
  const [closingTime, setClosingTime] = useState("");
  const [entries, setEntries] = useState([]);  // table entries
  const [no, setNo] = useState('');
  const [f, setF] = useState('');
  const [s, setS] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [file, setFile] = useState(null);
  // const [newId, setNewId] = useState(null); // 👈 new state to track latest data _id

  // State for storing permutations
//   const [permutations, setPermutations] = useState([]);  // we will set permutation in the table entreis

//   useEffect(() => {
//     if (drawDate && drawTime) {
//       getAndSetVoucherData();
//     }
//   }, [drawDate, drawTime]);

//   // get the user data profile
//   useEffect(() => {
//     ; (
//       async () => {

//         try {
//           const token = localStorage.getItem("token");
//           // console.log(token);

//           if (!token) {
//             navigate("/login");

//             return;
//           }

//           // Decode token to get user ID
//           const decodedToken = JSON.parse(atob(token.split(".")[1]));
//           const userId = decodedToken.id;
//           // console.log(userId);

//           const response = await axios.get(`/api/v1/users/${userId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           dispatch(setUser(response.data));
//           //setUser(response.data);
//         } catch (error) {
//           setError("Failed to load user data");
//           console.error(error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     )();

//   }, [dispatch, navigate]);


//   const addEntry = async (customeEntries = null) => {   
//     // e?.preventDefault();

//     const dataToAdd = customeEntries || entries;
//     if (dataToAdd.length > 0) {
//       try {
        

//         const formattedData = dataToAdd.map(entry => ({
//           uniqueId: entry.no,
//           firstPrice: Number(entry.f),
//           secondPrice: Number(entry.s)
//         }));

//         const response = await axios.post("/api/v1/data/add-data", {
//           timeSlot: drawTime,
//           data: formattedData,
//         }, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         // dispatch(hideLoading()); // Optional
//         toast.success("record added successfully! ✅");  // we have to use toast message instead of this (TBT)
//         // setEntries([]); // Clear after saving

//         await getAndSetVoucherData();    // Re-fetch data to update the UI

//       } catch (error) {
//         dispatch(hideLoading());
//         console.error("Error adding entries:", error.response?.data?.error || error.message);
//        toast.error(error.response?.data?.error || "Failed to add record ❌");
//       }
//     } else {
//       toast.warning("No record to save! ⚠️");
//     }
//   };


//   //  get the data from the backend on specific date and time slot

//   const fetchVoucherData = async (selectedDate, selectedTimeSlot) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get("/api/v1/data/get-data", {
//         params: {
//           date: selectedDate,
//           timeSlot: selectedTimeSlot,
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("getDatabydate", response);


//       return response.data.data;
//     } catch (error) {
//       toast.error((error.response?.data?.error ));
//       return [];
//     }
//   };

//   const getAndSetVoucherData = async () => {  // use in to fetch data base on time/date
//     const fetchedData = await fetchVoucherData(drawDate, drawTime);

//     if (Array.isArray(fetchedData) && fetchedData.length > 0) {
//       const filteredRecords = fetchedData.filter((record) => {
//         const recordDate = new Date(record.date).toISOString().split("T")[0];
//         const selectedDateISO = new Date(drawDate).toISOString().split("T")[0];
//         return (
//           recordDate === selectedDateISO &&
//           record.timeSlot === drawTime
//         );
//       });

//       const combinedEntries = filteredRecords.flatMap((record) =>
//         record.data.map((item, index) => ({
//           parentId: record._id, // to keep track of the parent record
//           objectId: item._id, // to keep track of the parent record
//           serial: index + 1, // creates a unique-enough ID without needing global index
//           no: item.uniqueId,
//           f: item.firstPrice,
//           s: item.secondPrice,
//           selected: false,
//         }))
//       );

//       setEntries(combinedEntries);
//       console.log("combined entires", combinedEntries);  // jo bhi entries hongi wo yengi


//     } else {
//       setEntries([]);
//     }
//   };

//   const groupedEntries = entries.reduce((acc, entry) => {
//     if (!acc[entry.parentId]) {
//       acc[entry.parentId] = [];
//     }
//     acc[entry.parentId].push(entry);
//     return acc;
//   }, {});

//   // delete handler the record based on id 

//   const handleDeleteRecord = async (parentId) => {

//     console.log("Deleting record with ID:", parentId);
//     try {
//       const token = localStorage.getItem('token');

//       await axios.delete(`/api/v1/data/delete-data/${parentId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success('Record deleted successfully');
//       await fetchVoucherData(); // Re-fetch updated data
//       await getAndSetVoucherData();

//     } catch (error) {
//       console.error('Error deleting record:', error);
//       toast.error('Failed to delete record');
//     }

//   };
   
//    // logout th user 
//    // utils/auth.js (or inside any component)

const handleLogout = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // if you're storing user info
  // Optionally show a toast
  toast.success("Logged out successfully!");
  // Navigate to login
  navigate("/login");
};







//   useEffect(() => {
//     // Calculate closing time (9 minutes before the next hour)
//     const [hour, period] = drawTime.split(" ");
//     let closingHour = parseInt(hour);
//     let closingPeriod = period;
//     if (closingHour === 12) {
//       closingPeriod = period === "AM" ? "PM" : "AM";
//     } else {
//       closingHour = closingHour + 1;
//     }
//     setClosingTime(`${closingHour === 12 ? 12 : closingHour}:${"51"} ${closingPeriod}`);
//   }, [drawTime]);

//   // Update current time every minute
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {  // this is loading that is running in seprately 
//     return <p className="text-center text-lg"><Spinner /></p>;
//   }

//   if (error) {
//     return <p className="text-center text-red-600">{error}</p>;
//   }



//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {

//       setFile(event.target.files[0]);
//     }
//   };


//   const handleUpload = () => {
//     if (!file) {
//       alert("Please select a file first.");  // toast use krna ha 
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

//    // 12 tandolla 

//    const generate3FigureRingWithX = (str) => {
//     if (str.length !== 3) {
//       console.log("Input must be a 3-digit string");
//       return [];
//     }
  
//     const result = [];
  
//     // Step 1: Regular permutations of the 3-digit number
//     const perms = Array.from(new Set(getPermutations(str))); // e.g., 001, 010, 100
//     result.push(...perms);
  
//     // Step 2: Insert 'x' at each position with padding
//     for (let perm of perms) {
//       result.push("x" + perm);                      // x001, x010, x100
//       result.push(perm[0] + "x" + perm.slice(1));   // 0x01, 0x10, 1x00
//       result.push(perm.slice(0, 2) + "x" + perm[2]); // 00x1, 01x0, 10x0
//     }
  
//     return Array.from(new Set(result)); // Remove any duplicates
//   };

//   // 6 digit ring 
//   const handle6FigureRing = () => {
//     if (no.length < 6) {
//       console.log("plz enter the ast leat 6 digits");
//       return;
//     }

//     const result = generate6DigitPermutations(no, 3);
//     console.log(result);


//     const updatedEntries = result.map((perm, index) => ({
//       id: entries.length + index + 1,
//       no: perm,
//       f: f,
//       s: s,
//       selected: false,
//     }));

//     setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);
//   }

//   // 5 digit ring 
//   const handle5FiguresRing = () => {
//     if (no.length < 5) {
//       console.log("plz enete the at least 5 digit");
//       return;
//     }

//     const result = generate5DigitPermutations(no, 3);
//     console.log(result);

//     const updatedEntries = result.map((perm, index) => ({
//       id: entries.length + index + 1,
//       no: perm,
//       f: f,
//       s: s,
//       selected: false,
//     }));

//     setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);
//   }

//   // 4 digit ring 
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
//       id: entries.length + index + 1,
//       no: perm,
//       f: f,
//       s: s,
//       selected: false,
//     }));


//     setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);
//   };

 
//    // 12 tandulla ring  


//    const handle3FigureRingWithX = () => {
//     if (no && f && s) {
//       // Generate permutations with 'x' substitutions
//       const generatedRingPermutations = generate3FigureRingWithX(no);
  
//       // Create new entry objects
//       const updatedEntries = generatedRingPermutations.map((perm, index) => ({
//         id: entries.length + index + 1,
//         no: perm,
//         f: f,
//         s: s,
//         selected: false
//       }));
  
//       console.log("3-Figure Ring Entries:", updatedEntries);
  
//       // Add entries using your existing handler
//       addEntry(updatedEntries);
//     }
//   };
  

//   const handleChakriRing = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);  // Generates multiple numbers

//       // Create new entries for each permutation
//       const updatedEntries = generatedPermutations.map((perm, index) => ({
//         id: entries.length + index + 1, // Ensure unique IDs
//         no: perm,
//         f: f,
//         s: s,
//         selected: false
//       }));
//       console.log(updatedEntries);

//       // setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);  // ✅ Append instead of replacing
//       // setTimeout (()=>{
//       //   addEntry();
//       // }, 0);
//       //  addEntry(); // Call addEntry with the new entries
//       addEntry(updatedEntries); // Pass the new entries to addEntry
//     }
//   };


//   // Handle Chakri Back Ring button click
//   const handleChakriRingBack = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       const updatedEntriesback = generatedPermutations.map((perm, index) => ({
//         id: entries.length + index + 1,
//         no: `x${perm}`, // Ensure both are strings
//         f: f,
//         s: s,
//         selected: false
//       }));
//       // setEntries((prevEntries) => [...prevEntries, ...updatedEntriesback]);  // ✅ Append instead of replacing
//       //  setNo(''),
//       //  setF(''),
//       //  setS('')
//       //  console.log(updatedEntriesback);
//       // set the fields empty
//       addEntry(updatedEntriesback); // Pass the new entries to addEntry
//     }
//   };

//   // Handle Chakri Ring button click
//   const handleChakriRingCross = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       const updatedEntriescross = generatedPermutations.map((perm, index) => {
//         const modifiedPerm = perm.slice(0, 1) + "x" + perm.slice(1); // Insert "x" at the second position

//         return {
//           id: entries.length + index + 1,
//           no: modifiedPerm,  // 1x23
//           f: f,
//           s: s,
//           selected: false
//         };
//       });

//       // setEntries((prevEntries) => [...prevEntries, ...updatedEntriescross]);  // ✅ Append instead of replacing
//       // setNo('');
//       // setF('');
//       // setS('');
//       // console.log(updatedEntriescross);
//       addEntry(updatedEntriescross); // Pass the new entries to addEntry
//     }
//   };

//   // Handle Chakri Ring with double cross button click
//   const handleChakriRingDouble = () => {
//     if (no && f && s) {
//       const generatedPermutations = getPermutations(no);
//       const updatedEntriesdouble = generatedPermutations.map((perm, index) => {
//         const modifiedPerm = perm.slice(0, 2) + "x" + perm.slice(2); // Insert "x" at the second position

//         return {
//           id: entries.length + index + 1,
//           no: modifiedPerm,  // 12x3
//           f: f,
//           s: s,
//           selected: false
//         };
//       });

//       // setEntries((prevEntries) => [...prevEntries, ...updatedEntriesdouble]);
//       // setNo('');
//       // setF('');
//       // setS('');
//       // console.log(updatedEntriesdouble);
//       addEntry(updatedEntriesdouble); // Pass the new entries to addEntry
//     }
//   };

//   // function to AKR 2 figure 

//   const handleAKR2Figure = () => {
//     if (no.length !== 2 || !f || !s) {
//       console.log("Please enter a 2-digit number and prices.");
//       return;
//     }

//     const num = no.toString();
//     const generatedPatterns = [
//       num,       // "23"
//       `+${num}+`,   // "+23+"
//       `++${num}`, // "++23"
//       `${num[0]}+${num[1]}`, // "2+3"
//       `+${num[0]}+${num[1]}`, // "+2+3"
//       `${num[0]}++${num[1]}`  // "2++3"
//     ];

//     const updatedEntries = generatedPatterns.map((pattern, index) => ({
//       id: entries.length + index + 1,
//       no: pattern,
//       f: f,
//       s: s,
//       selected: false
//     }));

//     setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);  // Append new entries
//   };

//   const handleAKR4Figure = () => {
//     if (no.length === 4 && f && s) {
//       // Step 1: Get all 2-letter combinations from 4-digit input
//       const combinations = getCombinations(no, 2);

//       // Step 2: Generate permutations for each combination
//       const pairs = combinations.flatMap(getPermutation);

//       // Step 3: Remove duplicates
//       const uniquePairs = [...new Set(pairs)];

//       // Step 4: Format and update entries
//       const formatted = uniquePairs.map((pair, index) => ({
//         id: entries.length + index + 1,
//         no: pair,
//         f: f,
//         s: s,
//         selected: false,
//       }));

//       setEntries((prev) => [...prev, ...formatted]);
//     } else {
//       alert("Please enter a valid 4-digit number and F/S values.");
//     }
//   };


//   const handleAKR5Figure = () => {
//     if (no.length === 5 && f && s) {
//       // Step 1: Get all 2-digit combinations
//       const combinations = getCombinations(no, 2);

//       // Step 2: Get all ordered permutations for those combinations
//       const pairs = combinations.flatMap(getPermutation);

//       // Step 3: Remove duplicates
//       const uniquePairs = [...new Set(pairs)];

//       // Step 4: Format for entries
//       const formatted = uniquePairs.map((pair, index) => ({
//         id: entries.length + index + 1,
//         no: pair,
//         f: f,
//         s: s,
//         selected: false,
//       }));

//       setEntries((prev) => [...prev, ...formatted]);
//     } else {
//       alert("Please enter a valid 5-digit number and F/S values.");
//     }
//   };



//   const handleAKR6Figure = () => {
//     if (no.length === 6 && f && s) {
//       // Step 1: Get all 2-digit combinations
//       const combinations = getCombinations(no, 2); // e.g. ["12", "13", "14", ...]

//       // Step 2: Get ordered permutations from those combinations
//       const orderedPairs = combinations.flatMap(getPermutation);

//       // Step 3: Filter out duplicates (like ["12", "21"] becomes both included, unless filtered)
//       const uniquePairs = [...new Set(orderedPairs)];

//       // Step 4: Format the entries for table display
//       const formatted = uniquePairs.map((pair, index) => ({
//         id: entries.length + index + 1,
//         no: pair,
//         f: f,
//         s: s,
//         selected: false,
//       }));

//       // Step 5: Add to entries
//       setEntries(prev => [...prev, ...formatted]);
//     } else {
//       alert("Please enter a valid 6-digit number and F/S values.");
//     }
//   };


//   const handleRingPlusAKR = () => {
//     if (no.length === 3 && f && s) {
//       const threeDigit = {
//         id: entries.length + 1,
//         no: no,
//         f: f,
//         s: s,
//         selected: false,
//       };

//       const twoDigit = {
//         id: entries.length + 2,
//         no: no.slice(0, 2),
//         f: f,
//         s: s,
//         selected: false,
//       };

//       setEntries(prev => [...prev, threeDigit, twoDigit]);
//     } else {
//       alert("Please enter exactly 3 digits and valid F/S values");
//     }
//   };





//   // handleprint
//   // Function to generate downloadable PDF
//   const handleDownloadPDF = async () => {
//     if (ledger !== "VOUCHER") {
//       toast.warn("Ledger must be set to VOUCHER.");
//       return;
//     }

//     const fetchedEntries = await fetchVoucherData(drawDate, drawTime); // <-- Pass drawTime now
//     if (fetchedEntries.length === 0) {
//       toast.info("No Record found..");
//       return;
//     }

//     const doc = new jsPDF("p", "mm", "a4");
//     const pageWidth = doc.internal.pageSize.width;

//     const addHeader = () => {
//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(18);
//       doc.text("Voucher Sheet", pageWidth / 2, 15, { align: "center" });

//       doc.setFontSize(12);
//       doc.text(`Dealer Name: ${userData?.user.username}`, 14, 30);  // You can make this dynamic
//       doc.text(`City: Karachi ${userData?.user.city}`, 14, 40);
//       doc.text(`Draw Date: ${drawDate}`, 14, 50);
//       doc.text(`Draw Time: ${drawTime}`, 14, 60);
//     };

//     addHeader();

//     // Merge all entries for the selected time slot
//     const allVoucherRows = fetchedEntries
//       .filter(entry => entry.timeSlot === drawTime)
//       .flatMap(entry => entry.data.map(item => [
//         item.uniqueId,
//         item.firstPrice,
//         item.secondPrice
//       ]));
//     // it work fine!
//     doc.autoTable({
//       startY: 70,
//       head: [["Num", "F", "S"]],
//       body: allVoucherRows,
//       theme: "grid",
//       headStyles: { fillColor: [0, 0, 255] },
//       styles: { align: "center", fontSize: 12 },
//       margin: { left: 14 },
//       didDrawPage: function (data) {
//         if (data.pageNumber > 1) {
//           // addHeader();
//           doc.setFontSize(14);
//           // doc.text("Continued...", pageWidth / 2, 65, { align: "center" });
//         }
//       },
//     });

//     doc.save("Voucher_Sheet_RLC.pdf");
//     toast.success("Voucher PDF downloaded successfully!");
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


  // const deleteSelected = () => {
  //   setEntries(entries.filter(entry => !entry.selected));
  // };

  // const deleteAll = () => {
  //   setEntries([]);
  // };

  // const toggleSelectAll = () => {
  //   setSelectAll(!selectAll);
  //   setEntries(entries.map(entry => ({ ...entry, selected: !selectAll })));
  // };
 
  const [activeTab, setActiveTab] = useState("book");


  return (
    <div className="flex h-screen min-h-[500px] bg-gray-900 text-gray-100 overflow-hidden">

    {/* Sidebar */}
    <div className="w-64 bg-gray-800 flex flex-col p-5 border-r border-gray-700">
      <div className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
        <FaDice className="text-3xl" />
        <span>Dealer Portal</span>
      </div>

      <nav className="flex flex-col space-y-3">
        <button
          onClick={() => setActiveTab("book")}
          className={`flex items-center px-3 py-2.5 rounded-md gap-2 transition-colors ${
            activeTab === "book" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <FaBook className="text-purple-400" />
          Book
        </button>

        <button
          onClick={() => setActiveTab("hisab")}
          className={`flex items-center px-3 py-2.5 rounded-md gap-2 transition-colors ${
            activeTab === "hisab" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <FaCalculator className="text-blue-400" />
          Hisab
        </button>

        <button
          onClick={() => setActiveTab("voucher")}
          className={`flex items-center px-3 py-2.5 rounded-md gap-2 transition-colors ${
            activeTab === "voucher" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <FaInbox className="text-green-400" />
          Voucher Inbox
        </button>
      </nav>

      <button
        className="mt-auto flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors"
        onClick={() => handleLogout(navigate)}
      >
        <FaSignOutAlt className="text-red-400" />
        Logout
      </button>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
      {activeTab === "book" && <Center />}
      {activeTab === "hisab" && <div className="p-6">Hisab content coming soon...</div>}  
      {activeTab === "voucher" && <div className="p-6">Voucher Inbox coming soon...</div>}  
    </div>
  </div>
  );
};

export default Layout;


