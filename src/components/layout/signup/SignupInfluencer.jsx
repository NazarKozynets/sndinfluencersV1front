import React, { useState } from "react";
import TitleSection from "../../TitleSection";
import FormContainer from "../../form/FormContainer";
import TextInput from "../../form/TextInput";
import StandartButton from "../../form/StandartButton";
import SelectedInput from "../../form/SelectedInput";
import ModalWindow from "../../ModalWindow";
import acceptIcon from "../../../images/icons/accept.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setAcceptAgree,
  setEmail,
  setFirstName,
  setInfluencerBrands,
  setInfluencerName,
  setInstagram,
  setInstagramAdd,
  setInstagramDelete,
  setPassword,
  setPhone,
  setRepeatPassword,
  setSignupClear,
} from "../../../redux/slice/signup-influencer";
import {
  formatPhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../../../utils/validations";
import { useNavigate } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import axios from "axios";
import CheckBox from "../../form/CheckBox";
import deleteIcon from "../../../images/icons/close.svg";
import InputFile from "../../form/InputFile";

const SignupInfluencer = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const dataForm = useSelector((state) => state.signupInfluencer);
  const [avatar, setAvatar] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [errorsForm, setErrorsForm] = useState({
    firstName: false,
    instagram: [
      {
        musicStyle: false,
        musicStyleOther: false,
        instagramUsername: false,
        instagramLink: false,
        followersNumber: false,
        logo: false,
        price: false,
      },
    ],
    email: false,
    phone: false,
    password: false,
    repeatPassword: false,
  });

  const [errorLogo, setErrorLogo] = useState(false);
  const [fileImage, setFile] = useState([]);

  const handleAvatar = (file, index) => {
    if (file && file.type.match("image.*")) {
      setFile([...fileImage, file]);
      const reader = new FileReader();

      reader.onload = (e) => {
        if(avatar[index]){
          let avatarNew  = avatar;
          avatarNew[index] =  { url: e.target.result };
          return setAvatar([...avatarNew]);
        }
        setAvatar([...avatar, { url: e.target.result }]);
      };

      reader.readAsDataURL(file);
    }
  };

  const nextForm = async () => {
    let errorsList = {
      firstName: false,
      musicStyle: false,
      musicStyleOther: false,
      instagram: errorsForm.instagram,
      followersNumber: false,
      email: false,
      phone: false,
      price: false,
      password: false,
      repeatPassword: false,
    };
    if (!dataForm.firstName) {
      errorsList = { ...errorsList, firstName: true };
    }

    if (!dataForm.musicStyle) {
      errorsList = { ...errorsList, musicStyle: true };
    }
    if (dataForm.musicStyle === "Other" && !dataForm.musicStyleOther) {
      errorsList = { ...errorsList, musicStyleOther: true };
    }

    if (!validateEmail(dataForm.email)) {
      errorsList = { ...errorsList, email: true };
    }
    if (!dataForm.phone) {
      errorsList = { ...errorsList, phone: true };
    }

    if (!dataForm.password) {
      errorsList = { ...errorsList, password: true };
    }

    let dataFormNew = dataForm;


    if (!fileImage || fileImage.length === 0) {
      return; // Nothing to upload
    }
  
    try {
      // Create a deep copy of dataFormNew to ensure immutability
      const updatedDataFormNew = {
        ...dataFormNew,
        instagram: await Promise.all(dataFormNew.instagram.map(async (instagramItem, index) => {
          if (index < fileImage.length) {
            const file = fileImage[index];
  
            const formData = new FormData();
            formData.append("file", file);
  
            const responseURL = await axios.post(
              `${process.env.REACT_APP_SERVER}/promos/uploadScreenshot`,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
  
            if (responseURL.data) {
              return { ...instagramItem, logo: responseURL.data.data }; // Updated item
            }
          }
  
          return instagramItem; // No changes needed
        }))
      };
  
      // Replace dataFormNew with the updated version (assuming you want to update)
      dataFormNew = updatedDataFormNew;
  
    } catch (error) {
      console.error("ERROR UPLOAD SCREENSHOT", error); 
    }

    let checkInstagram = false;
    const checkFormErrorInstagram = errorsForm.instagram.map((item, index) => {
      let instagramUsername = !Boolean(
        dataForm.instagram[index].instagramUsername
      );
      let instagramLink = !Boolean(dataForm.instagram[index].instagramLink);
      let followersNumber = !Boolean(dataForm.instagram[index].followersNumber);
      let price = !Boolean(dataForm.instagram[index].price);
      let musicStyle = !Boolean(dataForm.instagram[index].musicStyle);
      let musicStyleOther = !Boolean(dataForm.instagram[index].musicStyleOther);

      if (
        instagramUsername ||
        instagramLink ||
        followersNumber ||
        price ||
        musicStyle
      )
        checkInstagram = true;

      return {
        musicStyle: musicStyle,
        instagramUsername: instagramUsername,
        instagramLink: instagramLink,
        followersNumber: followersNumber,
        price: price,
      };
    });

    errorsList = { ...errorsList, instagram: checkFormErrorInstagram };

    if (
      !dataForm.firstName ||
      !dataForm.email ||
      checkInstagram ||
      !dataForm.phone ||
      !dataForm.password
    ) {
      return setErrorsForm(errorsList);
    }

    if (dataForm.password !== dataForm.repeatPassword) {
      return setErrorsForm({ ...errorsList, repeatPassword: true });
    }
    if (!dataForm.acceptAgree) return;
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_SERVER}/auth/create/influencer`,
        {
          firstName: dataForm.firstName,
          instagram: dataFormNew.instagram,
          email: dataForm.email,
          phone: dataForm.phone,
          password: dataForm.password,
        }
      );

      if (result.data.code === 201) {
        const requestToken = await axios.post(
          `${process.env.REACT_APP_SERVER}/auth/login/influencer`,
          {
            email: dataForm.email,
            password: dataForm.password,
          }
        );
        localStorage.setItem("token", requestToken.data.token);
        dispatch(setSignupClear());
        setOpenModal(true);
      }

      if (
        result.data.code === 409 &&
        result.data.message === "This instagram already exists"
      ) {
        return setErrorsForm({
          ...errorsForm,
          instagram: errorsForm.instagram.map((item) => ({
            ...item,
            instagramUsername: true,
          })),
        });
      }

      if (result.data.code === 409) {
        NotificationManager.error(
          "An account with this email already exists",
          "Error"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section className="signup-client">
        <div className="container-form">
          <div className="signup-client-block">
            <TitleSection
              title="Add Your details here
              to get approved as"
              span="an influencer"
            />

            <FormContainer style={{ marginTop: "60px" }}>
              <form className="signup-client-form">
                <TextInput
                  title="First name*"
                  placeholder="Enter name"
                  style={{ maxWidth: "665px", margin: "30px auto 60px auto" }}
                  value={dataForm.firstName}
                  setValue={(value) => dispatch(setFirstName(value))}
                  error={errorsForm.firstName}
                  onFocus={() =>
                    setErrorsForm({ ...errorsForm, firstName: false })
                  }
                />

                <div className="instagram-select">
                  {dataForm.instagram.map((item, index) => (
                    <div className="instagram-select-item" key={index}>
                      <SelectedInput
                        data={["Techno", "EDM", "House", "Other"]}
                        changeValue={(value) => {
                          dispatch(
                            setInstagram({
                              index: index,
                              data: { ...item, musicStyle: value },
                            })
                          );
                          const instagramErrors = errorsForm.instagram;
                          instagramErrors[index].musicStyle = false;
                          setErrorsForm({
                            ...errorsForm,
                            instagram: instagramErrors,
                          });
                        }}
                        title={`(${index + 1}) Music style*`}
                        placeholder={
                          dataForm.instagram[index].musicStyle === ""
                            ? "Сhoose music style"
                            : dataForm.instagram[index].musicStyle
                        }
                        style={{
                          maxWidth: "665px",
                          margin: "0 auto 60px auto",
                        }}
                        error={errorsForm.instagram[index].musicStyle}
                      />
                      {dataForm.instagram[index].musicStyle === "Other" ? (
                        <TextInput
                          title={`(${index + 1}) Music Style Other*`}
                          placeholder="Enter music style other"
                          style={{
                            maxWidth: "665px",
                            margin: "0 auto 60px auto",
                          }}
                          value={dataForm.instagram[index].musicStyleOther}
                          setValue={(value) =>
                            dispatch(
                              setInstagram({
                                index: index,
                                data: { ...item, musicStyleOther: value },
                              })
                            )
                          }
                          error={errorsForm.musicStyleOther}
                          onFocus={() => {
                            const instagramErrors = errorsForm.instagram;
                            instagramErrors[index].musicStyleOther = false;
                            setErrorsForm({
                              ...errorsForm,
                              instagram: instagramErrors,
                            });
                          }}
                        />
                      ) : (
                        <></>
                      )}
                      <TextInput
                        title={
                          dataForm.instagram.length === 1
                            ? "Instagram username*"
                            : `(${index + 1}) Instagram username*`
                        }
                        placeholder="Enter instagram username"
                        style={{ margin: "0 auto 60px auto" }}
                        value={item.instagramUsername}
                        setValue={(value) =>
                          dispatch(
                            setInstagram({
                              index: index,
                              data: { ...item, instagramUsername: value },
                            })
                          )
                        }
                        error={errorsForm.instagram[index].instagramUsername}
                        onFocus={() => {
                          const instagramErrors = errorsForm.instagram;
                          instagramErrors[index].instagramUsername = false;
                          setErrorsForm({
                            ...errorsForm,
                            instagram: instagramErrors,
                          });
                        }}
                      />

                      <TextInput
                        title={
                          dataForm.instagram.length === 1
                            ? "Instagram link*"
                            : `(${index + 1}) Instagram link*`
                        }
                        placeholder="Enter instagram link"
                        style={{ margin: "0 auto 60px auto" }}
                        value={item.instagramLink}
                        setValue={(value) =>
                          dispatch(
                            setInstagram({
                              index: index,
                              data: { ...item, instagramLink: value },
                            })
                          )
                        }
                        error={errorsForm.instagram[index].instagramLink}
                        onFocus={() => {
                          const instagramErrors = errorsForm.instagram;
                          instagramErrors[index].instagramLink = false;
                          setErrorsForm({
                            ...errorsForm,
                            instagram: instagramErrors,
                          });
                        }}
                      />
                      {index === 0 ? (
                        <></>
                      ) : (
                        <button
                          type="button"
                          className="instagram-select-item-delete"
                          onClick={() => {
                            const editErrorFormInstagram =
                              errorsForm.instagram.filter(
                                (item, itemIndex) => itemIndex !== index
                              );
                            setErrorsForm({
                              ...errorsForm,
                              instagram: editErrorFormInstagram,
                            });
                            dispatch(setInstagramDelete(index));
                          }}
                        >
                          <img
                            className="instagram-select-item-delete-icon"
                            src={deleteIcon}
                          />
                        </button>
                      )}
                      {/* Followers Number */}
                      <TextInput
                        title={
                          dataForm.instagram.length === 1
                            ? "Followers number*"
                            : `(${index + 1}) Followers number*`
                        }
                        placeholder="Enter followers number"
                        style={{
                          margin: "0 auto 60px auto",
                        }}
                        value={item.followersNumber}
                        setValue={(value) =>
                          dispatch(
                            setInstagram({
                              index: index,
                              data: { ...item, followersNumber: value },
                            })
                          )
                        }
                        error={errorsForm.instagram[index].followersNumber}
                        onFocus={() => {
                          const instagramErrors = errorsForm.instagram;
                          instagramErrors[index].followersNumber = false;
                          setErrorsForm({
                            ...errorsForm,
                            instagram: instagramErrors,
                          });
                        }}
                      />

                      {/* Logo */}
                      {/* <TextInput
                        title={
                          dataForm.instagram.length === 1
                            ? "Logo Link*"
                            : `(${index + 1}) Logo Link*`
                        }
                        placeholder="Enter logo link"
                        style={{
                          margin: "0 auto 60px auto",
                        }}
                        value={item.logo}
                        setValue={(value) =>
                          dispatch(
                            setInstagram({
                              index: index,
                              data: { ...item, logo: value },
                            })
                          )
                        }
                        error={errorsForm.instagram[index].logo}
                        onFocus={() => {
                          const instagramErrors = errorsForm.instagram;
                          instagramErrors[index].logo = false;
                          setErrorsForm({
                            ...errorsForm,
                            instagram: instagramErrors,
                          });
                        }}
                      /> */}

                      {avatar[index] && (
                        <img
                          style={{ marginTop: "20px", maxWidth: "70px" }}
                          src={avatar[index]?.url}
                        />
                      )}
                      <InputFile
                        title={
                          dataForm.instagram.length === 1
                            ? "Logo Link*"
                            : `(${index + 1}) Logo Link*`
                        }
                        placeholder="logo"
                        style={{ marginBottom: "50px", marginTop: "50px" }}
                        setValue={(value)=>handleAvatar(value, index)}
                        error={errorLogo}
                      />

                      {/* Price */}
                      <TextInput
                        title={
                          dataForm.instagram.length === 1
                            ? "Price for 1 Instagram Post & Story, include your currency*"
                            : `(${
                                index + 1
                              }) Price for 1 Instagram Post & Story, include your currency*`
                        }
                        placeholder="Enter Price for 1 Instagram Post & Story, include your currency*"
                        style={{
                          margin:
                            dataForm.instagram.length === index + 1
                              ? "0 auto 0px auto"
                              : "0 auto 60px auto",
                        }}
                        value={item.price}
                        setValue={(value) =>
                          dispatch(
                            setInstagram({
                              index: index,
                              data: { ...item, price: value },
                            })
                          )
                        }
                        error={errorsForm.instagram[index].price}
                        onFocus={() => {
                          const instagramErrors = errorsForm.instagram;
                          instagramErrors[index].price = false;
                          setErrorsForm({
                            ...errorsForm,
                            instagram: instagramErrors,
                          });
                        }}
                      />
                    </div>
                  ))}
                  <StandartButton
                    text="Add a New Instagram Account"
                    style={{ fontSize: 15, margin: "10px auto 0 auto" }}
                    onClick={() => {
                      setErrorsForm({
                        ...errorsForm,
                        instagram: [
                          ...errorsForm.instagram,
                          { instagramUsername: false, followersNumber: false },
                        ],
                      });
                      dispatch(setInstagramAdd());
                    }}
                  />
                </div>
                <TextInput
                  title="Email*"
                  placeholder="Enter email"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.email}
                  setValue={(value) => dispatch(setEmail(value))}
                  error={errorsForm.email}
                  onFocus={() => setErrorsForm({ ...errorsForm, email: false })}
                />

                <TextInput
                  title="Phone*"
                  placeholder="+_ _ ___ ___ __ __"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.phone}
                  setValue={(value) => dispatch(setPhone(value))}
                  error={errorsForm.phone}
                  onFocus={() => setErrorsForm({ ...errorsForm, phone: false })}
                />

                <TextInput
                  type="password"
                  title="Password"
                  placeholder="Enter password"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.password}
                  setValue={(value) => dispatch(setPassword(value))}
                  error={errorsForm.password}
                  onFocus={() =>
                    setErrorsForm({ ...errorsForm, password: false })
                  }
                />
                <TextInput
                  type="password"
                  title="Repeat Password"
                  placeholder="Repeat Password"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  value={dataForm.repeatPassword}
                  setValue={(value) => dispatch(setRepeatPassword(value))}
                  error={errorsForm.repeatPassword}
                  onFocus={() =>
                    setErrorsForm({ ...errorsForm, repeatPassword: false })
                  }
                />
                <CheckBox
                  page="influencer"
                  text="Agree to"
                  linkText="terms and conditions"
                  style={{ maxWidth: "665px", margin: "0 auto 60px auto" }}
                  checked={dataForm.acceptAgree}
                  setChecked={(value) => dispatch(setAcceptAgree(value))}
                />

                <StandartButton
                  text="Apply now"
                  style={{ margin: "70px auto 0 auto" }}
                  onClick={nextForm}
                />
              </form>
            </FormContainer>

            <ModalWindow isOpen={openModal} setClose={setOpenModal}>
              <div className="signup-client-modal">
                <img className="signup-client-modal-icon" src={acceptIcon} />

                <h2 className="signup-client-modal-title">Internal approval</h2>

                <p className="signup-client-modal-second">
                  Thank you for sharing your information.
                </p>

                <p className="signup-client-modal-desc">
                  We've got it and our team will review it carefully. If it fits
                  our criteria, we'll let you know. Thanks for your patience,
                  and we'll keep you posted.
                </p>

                <StandartButton
                  text="Ok"
                  style={{
                    padding: "8px 80px",
                    marginTop: "30px",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onClick={() => navigation("/account/influencer")}
                />
              </div>
            </ModalWindow>
          </div>
        </div>
        <NotificationContainer />
      </section>
    </>
  );
};

export default SignupInfluencer;
