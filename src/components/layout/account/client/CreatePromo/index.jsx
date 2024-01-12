import React, { useEffect, useState } from "react";
import AccountClientOffers from "./AccountClientOffers";
import AccountClientPostContent from "./AccountClientPostContent";
import AccountClientPayment from "./AccountClientPayment";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllFormInvoice } from "../../../../../redux/slice/create-invoice";

const CreatePromo = () => {
  const dispatch = useDispatch()
  const currentWindow = useSelector((state) => state.createPromo.currentWindow);
 
  return (
    <>
      {
        [
          <AccountClientOffers />,
          <AccountClientPostContent />,
          <AccountClientPayment />,
        ][currentWindow]
      }
    </>
  );
};

export default CreatePromo;
