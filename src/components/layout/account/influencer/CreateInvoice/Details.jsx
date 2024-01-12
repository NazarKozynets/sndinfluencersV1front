import React, { useState } from "react";
import StandartButton from "../../../../form/StandartButton";
import TextInput from "../../../../form/TextInput";
import TextArea from "../../../../form/TextArea";
import { useDispatch, useSelector } from "react-redux";
import {
  setCity,
  setClearForm,
  setCompanyId,
  setCompanyName,
  setContactEmail,
  setContactName,
  setContactPhone,
  setCountry,
  setNotes,
  setPostcode,
  setState,
  setStreet,
} from "../../../../../redux/slice/create-invoice";
import axios from "axios";
import UseVerify from "../../../../../hooks/useVerify";
import { useNavigate } from "react-router-dom";

const CreateInvoiceDetails = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const dataForm = useSelector((state) => state.createInvoice.data);
  const [selectDetails, setSelectDetails] = useState(false);
  const [switchVAT, setSwitchVAT] = useState(false);

  const [errorForm, setErrorForm] = useState({
    contactName: false,
    contactPhone: false,
    contactEmail: false,
    companyName: false,
    companyId: false,
    street: false,
    city: false,
    state: false,
    postcode: false,
    country: false,
    notes: false,
  });

  const nextForm = async () => {
    let listError = {
      contactName: false,
      contactPhone: false,
      contactEmail: false,
      companyName: false,
      companyId: false,
      street: false,
      city: false,
      state: false,
      postcode: false,
      country: false,
      notes: false,
    };
    let haveError = false;
    for (let checkError in listError) {
      if (dataForm[checkError] === "") {
        if (checkError === "companyName" && !selectDetails) {
          continue;
        }
        if (checkError === "companyId" && !selectDetails) {
          continue;
        }
        haveError = true;
        listError = {
          ...listError,
          [checkError]: true,
        };
      }
    }

    if (haveError) {
      setErrorForm(listError);
    }

    try {
      const { dataFetch } = await UseVerify();

      const result = await axios.post(
        `${process.env.REACT_APP_SERVER}/invoice/create`,
        {
          ...dataForm,
          influencerId: dataFetch._id,
        }
      );
      if (result.data.code === 201) {
        navigation(`/account/influencer/invoices`);
        dispatch(setClearForm());
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="container-form">
        <p className="create-invoice-second">Fill Invoice Recipient details</p>

        <div className="create-invoice-select">
          <button
            className={`create-invoice-select-button ${
              !selectDetails && "active"
            }`}
            onClick={() => setSelectDetails(false)}
          >
            Individual
          </button>
          <button
            className={`create-invoice-select-button ${
              selectDetails && "active"
            }`}
            onClick={() => setSelectDetails(true)}
          >
            Company
          </button>
        </div>

        <div className="create-invoice-form">
          <div className="create-invoice-form-header">
            <p className="create-invoice-form-header-title">Contact</p>
          </div>

          <div className="create-invoice-form-content">
            <TextInput
              title="Contact Name*"
              placeholder="Enter Contact Name"
              style={{ maxWidth: "665px", margin: "0 auto" }}
              value={dataForm.contactName}
              setValue={(value) => dispatch(setContactName(value))}
              error={errorForm.contactName}
              onFocus={() => setErrorForm({ ...errorForm, contactName: false })}
            />
            <TextInput
              title="Contact Phone*"
              placeholder="Enter Contact Phone"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.contactPhone}
              setValue={(value) => dispatch(setContactPhone(value))}
              error={errorForm.contactPhone}
              onFocus={() =>
                setErrorForm({ ...errorForm, contactPhone: false })
              }
            />
            <TextInput
              title="Contact Email*"
              placeholder="Enter Contact Email"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.contactEmail}
              setValue={(value) => dispatch(setContactEmail(value))}
              error={errorForm.contactEmail}
              onFocus={() =>
                setErrorForm({ ...errorForm, contactEmail: false })
              }
            />

            {!selectDetails && (
              <div
                className="create-invoice-form-content-switch"
                style={{
                  maxWidth: "665px",
                  margin: "0 auto",
                  marginTop: "60px",
                }}
              >
                <button
                  className={`create-invoice-form-content-switch-input ${
                    switchVAT && "active"
                  }`}
                  onClick={() => setSwitchVAT(!switchVAT)}
                >
                  <div className="create-invoice-form-content-switch-input-decor"></div>
                </button>

                <p className="create-invoice-form-content-switch-text">
                  VAT Registered
                </p>
              </div>
            )}
          </div>
        </div>

        {selectDetails && (
          <div className="create-invoice-form">
            <div className="create-invoice-form-header">
              <p className="create-invoice-form-header-title">Company</p>
            </div>

            <div className="create-invoice-form-content">
              <TextInput
                title="Company Name*"
                placeholder="Enter Company Name"
                style={{ maxWidth: "665px", margin: "0 auto" }}
                value={dataForm.companyName}
                setValue={(value) => dispatch(setCompanyName(value))}
                error={errorForm.companyName}
                onFocus={() =>
                  setErrorForm({ ...errorForm, companyName: false })
                }
              />
              <TextInput
                title="Company Id*"
                placeholder="Enter Company Id"
                style={{
                  maxWidth: "665px",
                  margin: "0 auto",
                  marginTop: "60px",
                }}
                value={dataForm.companyId}
                setValue={(value) => dispatch(setCompanyId(value))}
                error={errorForm.companyId}
                onFocus={() => setErrorForm({ ...errorForm, companyId: false })}
              />

              <div
                className="create-invoice-form-content-switch"
                style={{
                  maxWidth: "665px",
                  margin: "0 auto",
                  marginTop: "60px",
                }}
              >
                <button
                  className={`create-invoice-form-content-switch-input ${
                    switchVAT && "active"
                  }`}
                  onClick={() => setSwitchVAT(!switchVAT)}
                >
                  <div className="create-invoice-form-content-switch-input-decor"></div>
                </button>

                <p className="create-invoice-form-content-switch-text">
                  VAT Registered
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="create-invoice-form">
          <div className="create-invoice-form-header">
            <p className="create-invoice-form-header-title">Address</p>
          </div>

          <div className="create-invoice-form-content">
            <TextInput
              title="Street*"
              placeholder="Enter Street"
              style={{ maxWidth: "665px", margin: "0 auto" }}
              value={dataForm.street}
              setValue={(value) => dispatch(setStreet(value))}
              error={errorForm.street}
              onFocus={() => setErrorForm({ ...errorForm, street: false })}
            />
            <TextInput
              title="City*"
              placeholder="Enter City"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.city}
              setValue={(value) => dispatch(setCity(value))}
              error={errorForm.city}
              onFocus={() => setErrorForm({ ...errorForm, city: false })}
            />
            <TextInput
              title="State*"
              placeholder="Enter State"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.state}
              setValue={(value) => dispatch(setState(value))}
              error={errorForm.state}
              onFocus={() => setErrorForm({ ...errorForm, state: false })}
            />
            <TextInput
              title="Postcode*"
              placeholder="Enter Postcode"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.postcode}
              setValue={(value) => dispatch(setPostcode(value))}
              error={errorForm.postcode}
              onFocus={() => setErrorForm({ ...errorForm, postcode: false })}
            />
            <TextInput
              title="Country*"
              placeholder="Enter Country"
              style={{ maxWidth: "665px", margin: "0 auto", marginTop: "60px" }}
              value={dataForm.country}
              setValue={(value) => dispatch(setCountry(value))}
              error={errorForm.country}
              onFocus={() => setErrorForm({ ...errorForm, country: false })}
            />

            {selectDetails && (
              <div
                className="create-invoice-form-content-switch"
                style={{
                  maxWidth: "665px",
                  margin: "0 auto",
                  marginTop: "60px",
                }}
              >
                <button
                  className={`create-invoice-form-content-switch-input ${
                    switchVAT && "active"
                  }`}
                  onClick={() => setSwitchVAT(!switchVAT)}
                >
                  <div className="create-invoice-form-content-switch-input-decor"></div>
                </button>

                <p className="create-invoice-form-content-switch-text">
                  My registered office is different
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="create-invoice-form"
          style={{ paddingTop: "34px", paddingBottom: "34px" }}
        >
          <TextArea
            placeholder="Add a note to the invoice"
            style={{ maxWidth: "665px", margin: "0 auto" }}
            value={dataForm.notes}
            setValue={(value) => dispatch(setNotes(value))}
            error={errorForm.notes}
            onFocus={() => setErrorForm({ ...errorForm, notes: false })}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "60px",
          }}
        >
          <StandartButton text="Continue" onClick={nextForm} />
        </div>
      </div>
    </>
  );
};

export default CreateInvoiceDetails;
