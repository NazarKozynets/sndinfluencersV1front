import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import FormContainer from "../../../form/FormContainer";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UseVerify from "../../../../hooks/useVerify";
import ResponseButton from "../../../form/ResponseButton";
import altLogo from "../../../../images/alt-logo.jpg";
import ImageWithFallback from "../../../ImageWithFallback";

import arrow from "../../../../images/icons/arrow.svg";


const AcountClientPastPromosCurrent = () => {
  const params = useParams();
  const navigation = useNavigate();
  const [data, setData] = useState({});

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/promos/history/one?userId=${dataFetch._id}&promosId=${params.id}`
      );

      setData(result.data.promo);
      console.log(result.data.promo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="account-client-past-promos">
      <div className="container">
        <div className="account-client-past-promos-block" style={{position: "relative"}}>
          <TitleSection title="MY" span="account" />

          <p className="account-client-past-promos-second">Past promos</p>

          <button
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 50,
              height: 50,
              cursor: "pointer",
            }}
            onClick={() => {
              navigation("/account/influencer/past-promos")
            }}
          >
            <img src={arrow} style={{ transform: "rotate(180deg)" }} />
          </button>

          <FormContainer
            style={{
              marginTop: "70px",
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <div className="account-client-past-promos-form-current">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: 80,
                }}
              >
                <div
                  style={{
                    width: "45%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px"
                  }}
                >
                  <ImageWithFallback
                    src={data ? data.logo : ""}
                    style={{ width: "100%", maxWidth: 300 }}
                    fallbackSrc={altLogo}
                  />
                </div>
                <div
                  className="account-client-past-promos-form-current-content"
                  style={{ padding: "0 20px 30px 20px" }}
                >
                  <h2 className="account-client-past-promos-form-current-content-title">
                    Promo 1
                  </h2>
                  <p className="account-client-past-promos-form-current-content-client">
                    Client:{" "}
                    <span className="account-client-past-promos-form-current-content-client-value">
                      {data ? data.client : "No Data"}
                    </span>
                  </p>
                  <p className="account-client-past-promos-form-current-content-link">
                    Videolink:{" "}
                    <a
                      href={data ? data.videoLink : "No Data"}
                      className="account-client-past-promos-form-current-content-link-value"
                      target="_blank"
                    >
                      {data ? data.videoLink : "No Data"}
                    </a>
                  </p>
                  <p className="account-client-past-promos-form-current-content-desc">
                    Description:{" "}
                    <span className="account-client-past-promos-form-current-content-desc-value">
                      {data ? data.postDescription : "No Data"}
                    </span>
                  </p>
                  <p className="account-client-past-promos-form-current-content-date">
                    Date Request:{" "}
                    <span className="account-client-past-promos-form-current-content-date-value">
                      {data ? data.dateRequest : "No Data"}
                    </span>
                  </p>
                  <p className="account-client-past-promos-form-current-content-wish">
                    Special Wishes:{" "}
                    <span className="account-client-past-promos-form-current-content-wish-value">
                      {data ? data.specialWishes : "No Data"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </FormContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
            }}
          >
            <a
              href="mailto:admin@soundinfluencers.com?subject=Support%20Request"
              className="account-client-past-promos-current-report"
            >
              Click here for support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcountClientPastPromosCurrent;
