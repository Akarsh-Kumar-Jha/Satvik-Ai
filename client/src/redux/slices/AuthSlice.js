import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        isLoggedIn:false,
        User:null,
        loading:true
    },
    reducers:{
        login:(state,action)=>{
            state.isLoggedIn = true;
            state.User = action.payload;
            state.loading = false;
        },
        logout:(state,action)=>{
            state.isLoggedIn = false;
            state.User = null;
            state.loading = false
        },
        setLoading:(state,action) => {
            state.loading = false;
        }
    }
});

export const {login,logout,setLoading} = authSlice.actions;
export default authSlice.reducer;