import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  instagram: [
    {
      musicStyle: "",
      musicStyleOther: "",
      instagramUsername: "",
      followersNumber: "",
      logo: "",
      price: "",
    },
  ],
  email: "",
  phone: "",
  password: "",
  repeatPassword: "",
  acceptAgree: false,
};

export const signupInfluencerSlice = createSlice({
  name: "signup-influencer",
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setInfluencerBrands: (state, action) => {
      state.influencerBrands = action.payload;
    },
    setInstagram: (state, action) => {
      const editInstagram = state.instagram;
      editInstagram[action.payload.index] = {
        ...action.payload.data,
      };
      state.instagram = editInstagram;
    },
    setInstagramAdd: (state, action) => {
      state.instagram = [
        ...state.instagram,
        {
          musicStyle: "",
          musicStyleOther: "",
          instagramUsername: "",
          followersNumber: "",
          logo: "",
          price: "",
        },
      ];
    },
    setInstagramDelete: (state, action) => {
      const editInstagram = state.instagram.filter((item, index) => {
        if (index === action.payload) {
          return false;
        } else {
          return true;
        }
      });
      state.instagram = editInstagram;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRepeatPassword: (state, action) => {
      state.repeatPassword = action.payload;
    },
    setAcceptAgree: (state, action) => {
      state.acceptAgree = action.payload;
    },
    setSignupClear: (state) => {
      state.firstName = "";
      state.instagram = [
        {
          musicStyle: "",
          musicStyleOther: "",
          instagramUsername: "",
          followersNumber: "",
          logo: "",
          price: "",
        },
      ];
      state.email = "";
      state.phone = "";
      state.password = "";
      state.repeatPassword = "";
      state.acceptAgree = false;
    },
  },
});

export const {
  setFirstName,
  setInfluencerBrands,
  setMusicStyle,
  setMusicStyleOther,
  setInstagram,
  setFollowersNumber,
  setInstagramAdd,
  setInstagramDelete,
  setEmail,
  setPhone,
  setPassword,
  setRepeatPassword,
  setAcceptAgree,
  setSignupClear,
} = signupInfluencerSlice.actions;

export default signupInfluencerSlice.reducer;
