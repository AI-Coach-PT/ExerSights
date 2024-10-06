import { configureStore } from "@reduxjs/toolkit";
import landmarkReducer from "./LandmarkSlice";

export default configureStore({
    reducer: {
        landmarks: landmarkReducer,
    },
});
