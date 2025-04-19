import { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import axios from "axios";
import jsPDF from "jspdf";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';
// import { setData } from '../redux/features/dataSlice';

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
  const [permutations, setPermutations] = useState([]);  // we will set permutation in the table entreis

  useEffect(() => {
    if (drawDate && drawTime) {
      getAndSetVoucherData();
    }
  }, [drawDate, drawTime]);

  // get the user data profile
  useEffect(() => {
    ; (
      async () => {

        try {
          const token = localStorage.getItem("token");
          // console.log(token);

          if (!token) {
            navigate("/login");

            return;
          }

          // Decode token to get user ID
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const userId = decodedToken.id;
          // console.log(userId);

          const response = await axios.get(`/api/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(setUser(response.data));
          //setUser(response.data);
        } catch (error) {
          setError("Failed to load user data");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    )();

  }, [dispatch, navigate]);





  //  get the data from the backend on specific date and time slot

  const fetchVoucherData = async (selectedDate, selectedTimeSlot) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/v1/data/get-data", {
        params: {
          date: selectedDate,
          timeSlot: selectedTimeSlot,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);


      return response.data.data;
    } catch (error) {
      alert("Error fetching data: " + (error.response?.data?.error || error.message));
      return [];
    }
  };

  const getAndSetVoucherData = async () => {  // use in to fetch data base on time/date
    const fetchedData = await fetchVoucherData(drawDate, drawTime);

    if (Array.isArray(fetchedData) && fetchedData.length > 0) {
      const filteredRecords = fetchedData.filter((record) => {
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        const selectedDateISO = new Date(drawDate).toISOString().split("T")[0];
        return (
          recordDate === selectedDateISO &&
          record.timeSlot === drawTime
        );
      });

      const combinedEntries = filteredRecords.flatMap((record) =>
        record.data.map((item, index) => ({
          id: index + 1, // creates a unique-enough ID without needing global index
          no: item.uniqueId,
          f: item.firstPrice,
          s: item.secondPrice,
          selected: false,
        }))
      );

      setEntries(combinedEntries);
    } else {
      setEntries([]);
    }
  };

    
  // delete handler the record based on id 
  


  



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

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {  // this is loading that is running in seprately 
    return <p className="text-center text-lg"><Spinner /></p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }



  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {

      setFile(event.target.files[0]);
    }
  };


  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    console.log("Uploading:", file.name);
    // Add your file upload logic here (e.g., send to a backend server)
  };

  // Function to generate permutations
  const getPermutations = (str) => {
    let results = [];
    if (str.length === 1) return [str];

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remainingChars = str.slice(0, i) + str.slice(i + 1);
      const remainingPermutations = getPermutations(remainingChars);

      for (const perm of remainingPermutations) {
        results.push(char + perm);
      }
    }
    return results;
  };


  // Function to get combinations of a certain length (for 4 figures Ring 24)
  const getCombinations = (str, length) => {
    if (length === 1) return str.split("");
    if (length === str.length) return [str];

    let combinations = [];
    for (let i = 0; i < str.length; i++) {
      let remaining = str.slice(0, i) + str.slice(i + 1);
      let subCombinations = getCombinations(remaining, length - 1);
      subCombinations.forEach(sub => combinations.push(str[i] + sub));
    }
    return combinations;
  };

  // Function to get all permutations of a string
  const getPermutation = (str) => {
    if (str.length === 1) return [str];

    return str.split("").flatMap((char, i) =>
      getPermutation(str.slice(0, i) + str.slice(i + 1)).map(perm => char + perm)
    );
  };

  // Function to generate ordered 3-digit permutations (actual function to get permutation)
  const generateOrderedPermutations = (num, length = 3) => {
    let str = num.toString();
    if (str.length !== 4) {
      console.log("plz enter a 4 digit number");
      return [];
    }
    let combinations = getCombinations(str, length);
    let allPermutations = combinations.flatMap(getPermutation);

    return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
  };


  // genarte the 5 figure ring (60)
  const generate5DigitPermutations = (num, length = 3) => {
    let str = num.toString();
    if (str.length !== 5) {
      console.log("Please enter a 5-digit number.");
      return [];
    }

    let combinations = getCombinations(str, length);
    let allPermutations = combinations.flatMap(getPermutation);

    return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
  };

  // genarte the 5 digit ring (120)
  const generate6DigitPermutations = (num, length = 3) => {
    let str = num.toString();
    if (str.length !== 6) {
      console.log("Please enter a 6-digit number.");
      return [];
    }

    let combinations = getCombinations(str, length);
    let allPermutations = combinations.flatMap(getPermutation);

    return Array.from(new Set(allPermutations)).sort((a, b) => a[0].localeCompare(b[0]));
  };

  // 6 digit ring 
  const handle6FigureRing = () => {
    if (no.length < 6) {
      console.log("plz enter the ast leat 6 digits");
      return;
    }

    const result = generate6DigitPermutations(no, 3);
    console.log(result);


    const updatedEntries = result.map((perm, index) => ({
      id: entries.length + index + 1,
      no: perm,
      f: f,
      s: s,
      selected: false,
    }));

    setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);
  }

  // 5 digit ring 
  const handle5FiguresRing = () => {
    if (no.length < 5) {
      console.log("plz enete the at least 5 digit");
      return;
    }

    const result = generate5DigitPermutations(no, 3);
    console.log(result);

    const updatedEntries = result.map((perm, index) => ({
      id: entries.length + index + 1,
      no: perm,
      f: f,
      s: s,
      selected: false,
    }));

    setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);
  }

  // 4 digit ring 
  const handle4FiguresRing = () => {
    if (no.length < 4) {
      console.log("Please enter at least a 4-digit number.");
      return;
    }
    const result = generateOrderedPermutations(no, 3);
    console.log("Generated Permutations:", result); // Logs result in console

    //setPermutations(result); // Store the result in state

    // Update entries state with new permutations
    const updatedEntries = result.map((perm, index) => ({
      id: entries.length + index + 1,
      no: perm,
      f: f,
      s: s,
      selected: false,
    }));


    setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);
  };



  const handleChakriRing = () => {
    if (no && f && s) {
      const generatedPermutations = getPermutations(no);  // Generates multiple numbers

      // Create new entries for each permutation
      const updatedEntries = generatedPermutations.map((perm, index) => ({
        id: entries.length + index + 1, // Ensure unique IDs
        no: perm,
        f: f,
        s: s,
        selected: false
      }));
      console.log(updatedEntries);

      // setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);  // ✅ Append instead of replacing
      // setTimeout (()=>{
      //   addEntry();
      // }, 0);
      //  addEntry(); // Call addEntry with the new entries
      addEntry(updatedEntries); // Pass the new entries to addEntry
    }
  };


  // Handle Chakri Back Ring button click
  const handleChakriRingBack = () => {
    if (no && f && s) {
      const generatedPermutations = getPermutations(no);
      const updatedEntriesback = generatedPermutations.map((perm, index) => ({
        id: entries.length + index + 1,
        no: `x${perm}`, // Ensure both are strings
        f: f,
        s: s,
        selected: false
      }));
      // setEntries((prevEntries) => [...prevEntries, ...updatedEntriesback]);  // ✅ Append instead of replacing
      //  setNo(''),
      //  setF(''),
      //  setS('')
      //  console.log(updatedEntriesback);
      // set the fields empty
      addEntry(updatedEntriesback); // Pass the new entries to addEntry
    }
  };

  // Handle Chakri Ring button click
  const handleChakriRingCross = () => {
    if (no && f && s) {
      const generatedPermutations = getPermutations(no);
      const updatedEntriescross = generatedPermutations.map((perm, index) => {
        const modifiedPerm = perm.slice(0, 1) + "x" + perm.slice(1); // Insert "x" at the second position

        return {
          id: entries.length + index + 1,
          no: modifiedPerm,  // 1x23
          f: f,
          s: s,
          selected: false
        };
      });

      // setEntries((prevEntries) => [...prevEntries, ...updatedEntriescross]);  // ✅ Append instead of replacing
      // setNo('');
      // setF('');
      // setS('');
      // console.log(updatedEntriescross);
      addEntry(updatedEntriescross); // Pass the new entries to addEntry
    }
  };

  // Handle Chakri Ring with double cross button click
  const handleChakriRingDouble = () => {
    if (no && f && s) {
      const generatedPermutations = getPermutations(no);
      const updatedEntriesdouble = generatedPermutations.map((perm, index) => {
        const modifiedPerm = perm.slice(0, 2) + "x" + perm.slice(2); // Insert "x" at the second position

        return {
          id: entries.length + index + 1,
          no: modifiedPerm,  // 12x3
          f: f,
          s: s,
          selected: false
        };
      });

      // setEntries((prevEntries) => [...prevEntries, ...updatedEntriesdouble]);
      // setNo('');
      // setF('');
      // setS('');
      // console.log(updatedEntriesdouble);
      addEntry(updatedEntriesdouble); // Pass the new entries to addEntry
    }
  };

  // function to AKR 2 figure 

  const handleAKR2Figure = () => {
    if (no.length !== 2 || !f || !s) {
      console.log("Please enter a 2-digit number and prices.");
      return;
    }

    const num = no.toString();
    const generatedPatterns = [
      num,       // "23"
      `+${num}+`,   // "+23+"
      `++${num}`, // "++23"
      `${num[0]}+${num[1]}`, // "2+3"
      `+${num[0]}+${num[1]}`, // "+2+3"
      `${num[0]}++${num[1]}`  // "2++3"
    ];

    const updatedEntries = generatedPatterns.map((pattern, index) => ({
      id: entries.length + index + 1,
      no: pattern,
      f: f,
      s: s,
      selected: false
    }));

    setEntries((prevEntries) => [...prevEntries, ...updatedEntries]);  // Append new entries
  };

  const handleAKR4Figure = () => {
    if (no.length === 4 && f && s) {
      // Step 1: Get all 2-letter combinations from 4-digit input
      const combinations = getCombinations(no, 2);

      // Step 2: Generate permutations for each combination
      const pairs = combinations.flatMap(getPermutation);

      // Step 3: Remove duplicates
      const uniquePairs = [...new Set(pairs)];

      // Step 4: Format and update entries
      const formatted = uniquePairs.map((pair, index) => ({
        id: entries.length + index + 1,
        no: pair,
        f: f,
        s: s,
        selected: false,
      }));

      setEntries((prev) => [...prev, ...formatted]);
    } else {
      alert("Please enter a valid 4-digit number and F/S values.");
    }
  };


  const handleAKR5Figure = () => {
    if (no.length === 5 && f && s) {
      // Step 1: Get all 2-digit combinations
      const combinations = getCombinations(no, 2);

      // Step 2: Get all ordered permutations for those combinations
      const pairs = combinations.flatMap(getPermutation);

      // Step 3: Remove duplicates
      const uniquePairs = [...new Set(pairs)];

      // Step 4: Format for entries
      const formatted = uniquePairs.map((pair, index) => ({
        id: entries.length + index + 1,
        no: pair,
        f: f,
        s: s,
        selected: false,
      }));

      setEntries((prev) => [...prev, ...formatted]);
    } else {
      alert("Please enter a valid 5-digit number and F/S values.");
    }
  };



  const handleAKR6Figure = () => {
    if (no.length === 6 && f && s) {
      // Step 1: Get all 2-digit combinations
      const combinations = getCombinations(no, 2); // e.g. ["12", "13", "14", ...]

      // Step 2: Get ordered permutations from those combinations
      const orderedPairs = combinations.flatMap(getPermutation);

      // Step 3: Filter out duplicates (like ["12", "21"] becomes both included, unless filtered)
      const uniquePairs = [...new Set(orderedPairs)];

      // Step 4: Format the entries for table display
      const formatted = uniquePairs.map((pair, index) => ({
        id: entries.length + index + 1,
        no: pair,
        f: f,
        s: s,
        selected: false,
      }));

      // Step 5: Add to entries
      setEntries(prev => [...prev, ...formatted]);
    } else {
      alert("Please enter a valid 6-digit number and F/S values.");
    }
  };


  const handleRingPlusAKR = () => {
    if (no.length === 3 && f && s) {
      const threeDigit = {
        id: entries.length + 1,
        no: no,
        f: f,
        s: s,
        selected: false,
      };

      const twoDigit = {
        id: entries.length + 2,
        no: no.slice(0, 2),
        f: f,
        s: s,
        selected: false,
      };

      setEntries(prev => [...prev, threeDigit, twoDigit]);
    } else {
      alert("Please enter exactly 3 digits and valid F/S values");
    }
  };





  // handleprint
  // Function to generate downloadable PDF
  const handleDownloadPDF = async () => {
    if (ledger !== "VOUCHER") {
      alert("Ledger must be set to VOUCHER.");
      return;
    }

    const fetchedEntries = await fetchVoucherData(drawDate, drawTime); // <-- Pass drawTime now
    if (fetchedEntries.length === 0) {
      alert("No entries found for the selected date and time slot.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;

    const addHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Voucher Sheet", pageWidth / 2, 15, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Dealer Name: ${userData?.user.username}`, 14, 30);  // You can make this dynamic
      doc.text(`City: Karachi ${userData?.user.city}`, 14, 40);
      doc.text(`Draw Date: ${drawDate}`, 14, 50);
      doc.text(`Draw Time: ${drawTime}`, 14, 60);
    };

    addHeader();

    // Merge all entries for the selected time slot
    const allVoucherRows = fetchedEntries
      .filter(entry => entry.timeSlot === drawTime)
      .flatMap(entry => entry.data.map(item => [
        item.uniqueId,
        item.firstPrice,
        item.secondPrice
      ]));
    // it work fine!
    doc.autoTable({
      startY: 70,
      head: [["Num", "F", "S"]],
      body: allVoucherRows,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 255] },
      styles: { align: "center", fontSize: 12 },
      margin: { left: 14 },
      didDrawPage: function (data) {
        if (data.pageNumber > 1) {
          // addHeader();
          doc.setFontSize(14);
          // doc.text("Continued...", pageWidth / 2, 65, { align: "center" });
        }
      },
    });

    doc.save("Voucher_Sheet_RLC.pdf");
  };




  const isPastClosingTime = (time) => {
    const [hour, period] = time.split(" ");
    let drawHour = parseInt(hour, 10);
    if (period === "PM" && drawHour !== 12) drawHour += 12;
    if (period === "AM" && drawHour === 12) drawHour = 0;

    let closingHour = drawHour - 1;
    if (closingHour === -1) closingHour = 23;

    const closingTimeObj = new Date();
    closingTimeObj.setHours(closingHour, 51, 0);

    return currentTime >= closingTimeObj;
  };


  // useEffect 
  // consume the addDataForTimeSlot api
  // setps
  // Extract values (time slot, date, and data) from the state.

  // Make an API request to send the data to the backend.

  // Handle success or error responses properly.

  // Update the UI based on the response.

  const addEntry = async (customeEntries = null) => {   // e
    // e?.preventDefault();

    const dataToAdd = customeEntries || entries;
    if (dataToAdd.length > 0) {
      try {
        // dispatch(showLoading()); // Optional - if you're using a loading spinner

        const formattedData = dataToAdd.map(entry => ({
          uniqueId: entry.no,
          firstPrice: Number(entry.f),
          secondPrice: Number(entry.s)
        }));

        const response = await axios.post("/api/v1/data/add-data", {
          timeSlot: drawTime,
          data: formattedData,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // dispatch(hideLoading()); // Optional
        alert("Entries added successfully!");   // we have to use toast message instead of this (TBT)
        // setEntries([]); // Clear after saving

        await getAndSetVoucherData();

      } catch (error) {
        dispatch(hideLoading());
        console.error("Error adding entries:", error.response?.data?.error || error.message);
        alert(error.response?.data?.error || "Failed to add entries");
      }
    } else {
      alert("No entries to save!");
    }
  };


  //   const getDataById = async (id) => {
  //   console.log("get data");
  //     console.log(id);

  //   try {
  //     const response = await axios.get(`/api/v1/data/get-data/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const backendData = response.data.data.data;

  //     const formatted = backendData.map((entry, index) => ({
  //       id: index + 1,
  //       no: entry.uniqueId,
  //       f: entry.firstPrice,
  //       s: entry.secondPrice,
  //       selected: false,
  //     }));
  //     console.log(formatted);

  //     // Append the fetched data to the existing entries
  //     setEntries(formatted);
  //     console.log("data", formatted);
  //     console.log(entries); 

  //   } catch (error) {
  //     console.error("Error fetching data by ID:", error.response?.data?.error || error.message);
  //     alert("Failed to fetch data by ID");
  //   }
  // };



  const deleteSelected = () => {
    setEntries(entries.filter(entry => !entry.selected));
  };

  const deleteAll = () => {
    setEntries([]);
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setEntries(entries.map(entry => ({ ...entry, selected: !selectAll })));
  };



  return (
    <div className="flex h-screen min-h-[500px] bg-gray-900 text-gray-100 overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col p-5 border-r border-gray-700">
        <div className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-400">
          <FaDice className="text-3xl" />
          <span>Dealer Portal</span>
        </div>
        <nav className="flex flex-col space-y-3">
          <a href="/" className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors">
            <FaBook className="text-purple-400" />
            Book
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors">
            <FaCalculator className="text-blue-400" />
            Hisab
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 rounded-md hover:bg-gray-700 gap-2 transition-colors">
            <FaInbox className="text-green-400" />
            Voucher Inbox
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ">
        {/* Header */}
        <header className="bg-gray-800 p-4 rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-3 items-start mb-6 border border-gray-700">
          <div className="flex flex-col space-y-4 p-4">

            <div className="flex items-center gap-2 text-lg">
              <FaUserTie className="text-blue-400" />
              <span className="font-semibold">Name:</span>

              <input
                type="text"
                value={userData?.user.username}
                className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1"
                readOnly
              />
            </div>

            <div className="flex items-center gap-2 text-lg">
              <FaUserTie className="text-blue-400" />
              <span className="font-semibold">ID:</span>
              <input
                type="text"
                value={userData?.user.dealerId}
                className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1"
                readOnly
              />

            </div>

            <div className="flex items-center gap-2 text-lg">
              <FaCity className="text-blue-400" />
              <span className="font-semibold">CITY:</span>
              <input
                type="text"
                value={userData?.user?.city}
                className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1"
                readOnly
              />

            </div>


            <div className="flex items-center gap-2 text-lg">
              <FaBalanceScale className="text-blue-400" />
              <span className="font-semibold">BALANCE:</span>
              <input
                type="text"
                value={userData?.user?.balance}
                className="bg-gray-700 text-gray-100 px-3 py-1.5 rounded-lg border border-gray-600 flex-1"
                readOnly
              />

            </div>
          </div>
          {/* user info done here */}

          <div className="flex flex-col space-y-2">
            {/* Ledger dropdown */}
            <div className="text-lg font-semibold flex items-center space-x-2">
              <span>Ledger:</span>
              <select
                className="bg-gray-700 text-gray-100 px-3 py-2 rounded-lg border border-gray-600 flex-1"
                value={ledger}
                onChange={(e) => setLedger(e.target.value)}
              >
                <option>LEDGER</option>
                <option>DAILY BILL</option>
                <option>VOUCHER</option>
              </select>
            </div>

            {/* Draw Name Dropdown */}
            <div className="text-lg font-semibold flex items-center space-x-2">
              <FaClock className="text-purple-400" />
              <span>Draw Name:</span>
              <select
                className="bg-gray-700 text-white px-2 py-1 rounded"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
              >
                {[...Array(13)].map((_, i) => {
                  const hour = 11 + i;
                  const period = hour >= 12 ? "PM" : "AM";
                  const formattedHour = hour > 12 ? hour - 12 : hour;
                  const time = `${formattedHour === 0 ? 12 : formattedHour} ${period}`;
                  return (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Draw Date Input */}
            <div className="text-lg font-semibold flex items-center space-x-2">
              <FaCalendarAlt className="text-purple-400" />
              <span>Draw Date:</span>
              <input
                type="date"
                className="bg-gray-400 text-white px-2 py-1 rounded"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
              />
            </div>

            {/* Print Button */}
            <button
              className="flex items-center  space-x-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-500 transition"
              onClick={handleDownloadPDF}
            >
              <FaPrint />
              <span >Print</span>
            </button>
          </div>
          {/* ledger voucher bill print end here */}

          {/* Draw Time Section */}
          <div className=" p-4 bg-gray-800 rounded-lg  border border-gray-900 text-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <FaClock className="text-purple-400" />
              <span>Draw Time Selection</span>
            </h2>

            {/* Time Dropdown */}
            <div className="mb-4">
              <label className="flex text-lg font-semibold mb-2 flex items-center space-x-2">
                <FaClock className="text-purple-400" />
                <span>Select Draw Time:</span>
              </label>
              <select
                className="bg-gray-700 text-white px-3 py-2 rounded w-full border border-gray-600"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
              >
                {[...Array(13)].map((_, i) => {
                  const hour = 11 + i;
                  const period = hour >= 12 ? "PM" : "AM";
                  const formattedHour = hour > 12 ? hour - 12 : hour;
                  const time = `${formattedHour === 0 ? 12 : formattedHour} ${period}`;
                  return (
                    <option
                      key={time}
                      value={time}
                      disabled={isPastClosingTime(time)}
                      className={`${isPastClosingTime(time) ? "bg-red-500 text-white" : "bg-gray-700 text-white"
                        }`}
                    >
                      {time} {isPastClosingTime(time) ? "(Closed)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Today Date */}
            <p className="text-white flex items-center space-x-2">
              <FaCalendarAlt className="text-purple-400" />
              <span>
                <strong>Today Date:</strong> {new Date().toLocaleDateString()} (
                {new Date().toLocaleString("en-us", { weekday: "long" })})
              </span>
            </p>

            {/* Closing Time Calculation */}
            <p className="text-white flex items-center space-x-2 mt-2">
              <FaClock className="text-purple-400" />
              <span>
                <strong>Closing Time:</strong>{" "}
                {(() => {
                  const [hour, period] = drawTime.split(" ");
                  let closingHour = parseInt(hour, 10);
                  if (period === "PM" && closingHour !== 12) closingHour += 12;
                  const closingTime = new Date();
                  closingTime.setHours(closingHour - 1, 51, 0);
                  return closingTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                })()}
              </span>
            </p>
          </div>

          <div className='bg-gray-800 rounded-xl p-4 border border-gray-900' >
            Draw numbers
          </div>

        </header>
        {/* // header end */}


        {/* Body Content */}
        <div className="grid grid-cols-2 gap-6 mt-6 ">

          {/* Table Content */}
          <div className='bg-gray-800 border border-gray-700 min-h-[500px] p-6 rounded-lg shadow-md flex flex-col'>
            <div className='flex space-x-4 mb-4'>
              <button onClick={toggleSelectAll} className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 flex items-center gap-2'>
                <FaCheckSquare /> {selectAll ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={deleteSelected} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 flex items-center gap-2'>
                <FaTrash /> Delete Selected
              </button>
              <button onClick={deleteAll} className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500'>Delete All</button>
            </div>


            {        /* Table Header */}
            <div className='flex justify-center my-2'>
              <span className='text-2xl'>{`(${entries.length})`}</span>
            </div>

            {entries.length === 0 && (
              <div className='text-center text-red-500'>No entries to display</div>
            )}

            <div className='max-h-80 border rounded-md overflow-y-auto'>
              <table className='w-full border-collapse'>
                <thead>
                  <tr className='bg-gray-700'>
                    <th className='border p-2'>Select</th>
                    <th className='border p-2'>Num</th>
                    <th className='border p-2'>F</th>
                    <th className='border p-2'>S</th>
                    <th className='border p-2'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className='border-b'>
                      <td className='border p-2 text-center'>
                        <input
                          type='checkbox'
                          checked={entry.selected}
                          onChange={() => toggleCheckbox(entry.id)}
                        />
                      </td>
                      <td className='border p-2 text-center'>{entry.no}</td>
                      <td className='border p-2 text-center'>{entry.f}</td>
                      <td className='border p-2 text-center'>{entry.s}</td>
                      <td className='border p-2 text-center'>
                        <button
                          onClick={() => handleDeleteRecord(entry._id)}
                          className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Input Fields - Fixed at the Bottom */}
            <div className='mt-auto flex space-x-2 pt-4'>
              <input
                type='text'
                value={no}
                onChange={(e) => setNo(e.target.value)}
                placeholder='NO'
                className='border p-2 rounded w-1/3'
                disabled={isPastClosingTime(drawTime)}
              />
              <input
                type='text'
                value={f}
                onChange={(e) => setF(e.target.value)}
                placeholder='F'
                className='border p-2 rounded w-1/3'
                disabled={isPastClosingTime(drawTime)}
              />
              <input
                type='text'
                value={s}
                onChange={(e) => setS(e.target.value)}
                placeholder='S'
                className='border p-2 rounded w-1/3'
                disabled={isPastClosingTime(drawTime)}
              />
              <button
                onClick={(e) => addEntry(e)}
                className={`px-4 py-2 rounded text-white ${isPastClosingTime(drawTime) ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"}`}
                disabled={isPastClosingTime(drawTime)}
              >
                Save
              </button>
            </div>
          </div>




          {/* Printable Voucher */}




          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md text-white">
            <div className="flex space-x-4 mb-4">
              <div>
                {/* Hidden file input */}
                <input type="file" className="hidden" id="fileInput" onChange={handleFileChange} />

                {/* Upload Button */}
                <label htmlFor="fileInput" className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer">
                  <FaFileUpload />
                  <span>Choose File</span>
                </label>

                <button onClick={handleUpload} className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 mt-2">
                  <FaArrowUp />
                  <span>Upload Sheet</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-400">
                <FaEye />
                <span>View Sheet</span>
              </button>
            </div>
            {/* Buttons Section */}
            <div className="flex gap-4 pt-4">
              {/* Left Column */}
              <div className="w-1/2">
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleChakriRing}>
                  <FaStar /> <span>Chakri Ring</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleChakriRingBack}>
                  <FaStar /> <span>Back Ring</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleChakriRingCross}>
                  <FaStar /> <span>Cross Ring</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleChakriRingDouble}>
                  <FaStar /> <span>Double Cross</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handle5FiguresRing}>
                  <FaStar /> <span>5 Figure Ring</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handle6FigureRing}>
                  <FaStar /> <span>6 Figure Ring</span>
                </button>
              </div>
              {/* Right Column */}
              <div className="w-1/2">
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handle4FiguresRing}>
                  <FaStar /> <span>4 Figure Ring</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleAKR2Figure}>
                  <FaMoon /> <span>2 Figure AKR</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleAKR4Figure}>
                  <FaMoon /> <span>4 Figure AKR</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleAKR5Figure}>
                  <FaMoon /> <span>5 Figure AKR</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleAKR6Figure}>
                  <FaMoon /> <span>6 Figure AKR</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 m-2" onClick={handleRingPlusAKR}>
                  <FaMoon /> <span>Ring + AKR</span>
                </button>
              </div>
            </div>
          </div>

        </div>
        {/* this is grid of two cols of table and buttons */}
      </div>
      {/* this is the end of center content */}


    </div>
  );
};

export default Layout;


