import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Fetch site configuration
export const fetchSiteSettings = createAsyncThunk(
  "siteSettings/fetchSettings",
  async () => {
    const response = await axios.get(`${API_URL}/api/site-settings`);
    return response.data;
  }
);

// Update site configuration (Admin Only)
export const updateSiteSettings = createAsyncThunk(
  "siteSettings/updateSettings",
  async (formData) => {
    const response = await axios.patch(
      `${API_URL}/api/admin/site-settings`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

const siteSettingsSlice = createSlice({
  name: "siteSettings",
  initialState: {
    settings: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateSiteSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSiteSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default siteSettingsSlice.reducer;
