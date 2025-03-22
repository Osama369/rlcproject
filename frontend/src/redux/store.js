import {configureStore}  from "@reduxjs/toolkit"
import { alertSlice } from "./features/alertSlice"
// configure the store 
import  userSlice  from "./features/userSlice"
export default  configureStore({

    reducer:{  // this is the reducer 
        alertSlice : alertSlice.reducer,
        user: userSlice
    },
})

