import { createSlice } from "@reduxjs/toolkit";

export const landmarkSlice = createSlice({
    name: "landmark",
    initialState: {
        value: 0,
    },
    reducers: {
        setLandmarks: (state, action) => {
            state.value = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setLandmarks } = landmarkSlice.actions;

export default landmarkSlice.reducer;
