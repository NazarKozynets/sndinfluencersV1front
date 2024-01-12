import React, { useEffect, useState } from "react";
import TitleSection from "../../../TitleSection";
import { useTable } from "react-table";
import { useParams } from "react-router-dom";
import axios from "axios";
import UseVerify from "../../../../hooks/useVerify";
import {
  extractNumber,
  formatDateString,
  formatDateStringReport,
} from "../../../../utils/validations";

const ReportCampaigns = () => {
  const params = useParams();

  const [company, setCompany] = useState({});
  const [dataPromo, setDataPromo] = useState(null);
  const [data, setData] = useState([
    {
      name: "Techno TV",
      score: "181000",
      brand: "Madrid Show",
      datePost: "1-7 April",
      caption: "@pegg...",
      video: "https:/driv...",
      swipeUpLink: "https:/link...",
      storyTag: "@circol...",
      postLink: "https:/ww...",
      screenshot: "https:/drive.g...",
      impressions: "5388",
      like: "46",
    },
  ]);

  const [headers] = useState([
    {
      Header: "Brand",
      accessor: "Brand",
    },
    {
      Header: "Date Post",
      accessor: "Date Post",
    },
    {
      Header: "Caption",
      accessor: "Caption",
    },
    {
      Header: "Video",
      accessor: "Video",
    },
    {
      Header: "Swipe Up Link",
      accessor: "Swipe Up Link",
    },
    {
      Header: "Story Tag",
      accessor: "Story Tag",
    },
    {
      Header: "Post Link",
      accessor: "Post Link",
    },
    {
      Header: "Screenshot In",
      accessor: "Screenshot In",
    },
    {
      Header: "Impressions",
      accessor: "Impressions",
    },
    {
      Header: "Likes",
      accessor: "Likes",
    },
  ]);

  const getData = async () => {
    try {
      const { dataFetch } = await UseVerify();
      const result = await axios(
        `${process.env.REACT_APP_SERVER}/promos/ongoing/one?id=${params.id}&userId=${dataFetch._id}`
      );
      console.log(result.data.promo);
      setCompany(dataFetch);
      if (result.data.code === 200) {
        setDataPromo(result.data.promo);
        setData(result.data.promo.selectInfluencers);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const totalFollowers = () => {
    const total = data.reduce((prev, current) => {
      return prev + extractNumber(current.followersNumber);
    }, 0);

    return total;
  };

  const totalImpressions = () => {
    const total = data.reduce((prev, current) => {
      return prev + extractNumber(current.impressions);
    }, 0);

    return total;
  };

  const totalLikes = () => {
    const total = data.reduce((prev, current) => {
      return prev + extractNumber(current.like);
    }, 0);

    return total;
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <section className="report">
      <div className="container">
        <div className="report-block">
          <TitleSection title="report" span="of the campaigns" />

          <div className="report-info">
            <div className="report-info-item">
              <p className="report-info-text">
                Date submitted:{" "}
                {dataPromo
                  ? formatDateStringReport(dataPromo.createdAt)
                  : "No Date"}
              </p>
            </div>
            <div className="report-info-item">
              <p className="report-info-text">
                Brand:
                <span className="report-info-text-span">
                  {dataPromo
                    ? dataPromo.brand
                      ? dataPromo.brand
                      : "No Data"
                    : "No Data"}
                </span>
              </p>
              <p className="report-info-text">
                Date Requested: {dataPromo ? dataPromo.dateRequest : "No Date"}
              </p>
            </div>
          </div>

          <table className="report-table">
            <thead className="report-table-header">
              <tr>
                <td></td>
                <td className="report-table-header-item">Total Followers</td>
                {headers.map((head) => (
                  <td className="report-table-header-item">{head.Header}</td>
                ))}
              </tr>
            </thead>
            <tbody className="report-table-body">
              {dataPromo ? (
                <>
                  {data.map((item, indexRow) => (
                    <tr className="report-table-body-row">
                      <td className="report-table-body-row-item-first">
                        {item.instagramUsername
                          ? item.instagramUsername
                          : "No Date"}
                      </td>
                      <td className="report-table-body-row-item">
                        {item.followersNumber
                          ? item.followersNumber
                          : "No Date"}
                      </td>
                      <td className="report-table-body-row-item-second">
                        {dataPromo.brand ? dataPromo.brand : "No Date"}
                      </td>
                      <td className="report-table-body-row-item">
                        {dataPromo.createdAt
                          ? formatDateStringReport(dataPromo.createdAt)
                          : "No Date"}
                      </td>
                      <td className="report-table-body-row-item-second">
                        {dataPromo.postDescription
                          ? dataPromo.postDescription
                          : "No Date"}
                      </td>
                      <td className="report-table-body-row-item">
                        {dataPromo.videoLink ? (
                          <a target="_blank" href={dataPromo.videoLink}>
                            {dataPromo.videoLink}
                          </a>
                        ) : (
                          "No Date"
                        )}
                      </td>
                      <td className="report-table-body-row-item-second">
                        {dataPromo.swipeUpLink ? (
                          <a target="_blank" href={dataPromo.swipeUpLink}>
                            {dataPromo.swipeUpLink}
                          </a>
                        ) : (
                          "No Date"
                        )}
                      </td>
                      <td className="report-table-body-row-item">
                        {dataPromo.storyTag ? (
                          <a target="_blank" href={dataPromo.storyTag}>
                            {dataPromo.storyTag}
                          </a>
                        ) : (
                          "No Date"
                        )}
                      </td>
                      <td className="report-table-body-row-item-second">
                        {item.postLink ? (
                          <a target="_blank" href={item.postLink}>
                            {item.postLink}
                          </a>
                        ) : (
                          "No Date"
                        )}
                      </td>
                      <td className="report-table-body-row-item">
                        {item.screenshot ? (
                          <a target="_blank" href={item.screenshot}>
                            {item.screenshot}
                          </a>
                        ) : (
                          "No Date"
                        )}
                      </td>
                      <td className="report-table-body-row-item-second">
                        {item.impressions ? item.impressions : "No Date"}
                      </td>
                      <td className="report-table-body-row-item">
                        {item.like ? item.like : "No Date"}
                      </td>
                    </tr>
                  ))}
                </>
              ) : null}
              <tr className="report-table-body-total">
                <td className="report-table-body-total-price">
                  TOTAL Posts: {data.length}
                </td>

                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
              </tr>
              <tr className="report-table-body-total">
                <td className="report-table-body-total-price">
                  TOTAL Stories: {data.length}
                </td>

                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
              </tr>
              <tr className="report-table-body-total">
                <td className="report-table-body-total-price">
                  TOTAL Impressions: {totalImpressions()}
                </td>

                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
              </tr>

              <tr className="report-table-body-total">
                <td className="report-table-body-total-price">
                  TOTAL Likes: {totalLikes()}
                </td>

                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
              </tr>
              <tr className="report-table-body-total">
                <td className="report-table-body-total-price">
                  TOTAL Followers: {totalFollowers()}
                </td>

                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
              </tr>
              <tr className="report-table-body-total">
                <td className="report-table-body-total-price">
                  TOTAL: {dataPromo ? dataPromo.selectPrice.price : 0}€
                </td>

                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
                <td className="report-table-body-row-item-second"></td>
                <td className="report-table-body-row-item"></td>
              </tr>
            </tbody>
          </table>

          <div className="report-mobile">
            {dataPromo ? (
              <>
                {" "}
                {data.map((item) => (
                  <div className="report-mobile-item">
                    <div className="report-mobile-item-influencer">
                      {item.instagramUsername
                        ? item.instagramUsername
                        : "No Date"}
                    </div>
                    <div className="report-mobile-item-info">
                      <p className="report-mobile-item-info-followers">
                        {" "}
                        {item.followersNumber
                          ? item.followersNumber
                          : "No Date"}
                      </p>
                      <div className="report-mobile-item-info-brand">
                        <p className="report-mobile-item-info-value">
                          {" "}
                          {dataPromo.brand ? dataPromo.brand : "No Date"}
                        </p>
                        <p className="report-mobile-item-info-title">Brand</p>
                      </div>
                      <div className="report-mobile-item-info-date-post">
                        <p className="report-mobile-item-info-value">
                          {" "}
                          {dataPromo.createdAt
                            ? formatDateStringReport(dataPromo.createdAt)
                            : "No Date"}
                        </p>
                        <p className="report-mobile-item-info-title">
                          Date Post
                        </p>
                      </div>
                      <div className="report-mobile-item-info-caption">
                        <p className="report-mobile-item-info-value">
                          {" "}
                          {dataPromo.postDescription
                            ? dataPromo.postDescription
                            : "No Date"}
                        </p>
                        <p className="report-mobile-item-info-title">Caption</p>
                      </div>
                      <div className="report-mobile-item-info-video">
                        <a
                          target="_blank"
                          className="report-mobile-item-info-value"
                          href={dataPromo.videoLink ? dataPromo.videoLink : ""}
                        >
                          {" "}
                          {dataPromo.videoLink
                            ? dataPromo.videoLink
                            : "No Date"}
                        </a>

                        <p className="report-mobile-item-info-title">Video</p>
                      </div>
                      <div className="report-mobile-item-info-swipe-up-link">
                        <a
                          target="_blank"
                          className="report-mobile-item-info-value"
                          href={
                            dataPromo.swipeUpLink ? dataPromo.swipeUpLink : ""
                          }
                        >
                          {dataPromo.swipeUpLink
                            ? dataPromo.swipeUpLink
                            : "No Date"}
                        </a>
                        <p className="report-mobile-item-info-title">
                          Swipe Up Link
                        </p>
                      </div>
                      <div className="report-mobile-item-info-story-tag">
                        <p className="report-mobile-item-info-value">
                          {" "}
                          {dataPromo.storyTag ? dataPromo.storyTag : "No Date"}
                        </p>
                        <p className="report-mobile-item-info-title">
                          Story Tag
                        </p>
                      </div>
                      <div className="report-mobile-item-info-post-link">
                        <a
                          target="_blank"
                          className="report-mobile-item-info-value"
                          href={item.postLink ? item.postLink : ""}
                        >
                          {" "}
                          {item.postLink ? item.postLink : "No Date"}
                        </a>
                        <p className="report-mobile-item-info-title">
                          Post Link
                        </p>
                      </div>
                      <div className="report-mobile-item-info-screenshot">
                        <a
                          target="_blank"
                          className="report-mobile-item-info-value"
                          href={item.screenshot ? item.screenshot : ""}
                        >
                          {" "}
                          {item.screenshot ? item.screenshot : "No Date"}
                        </a>
                        <p className="report-mobile-item-info-title">
                          Screenshot In
                        </p>
                      </div>
                      <div className="report-mobile-item-info-impressions">
                        <p className="report-mobile-item-info-value">
                          {" "}
                          {item.impressions ? item.impressions : "No Date"}
                        </p>
                        <p className="report-mobile-item-info-title">
                          Impressions
                        </p>
                      </div>
                      <div className="report-mobile-item-info-like">
                        <p className="report-mobile-item-info-value">
                          {" "}
                          {item.like ? item.like : "No Date"}
                        </p>
                        <p className="report-mobile-item-info-title">Likes</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : null}
            <div
              className="report-mobile-item"
              style={{ background: "#FF7A09" }}
            >
              <p className="report-mobile-item-total">
                TOTAL Posts: {data.length}
              </p>
            </div>
            <div
              className="report-mobile-item"
              style={{ background: "#FF7A09" }}
            >
              <p className="report-mobile-item-total">
                TOTAL Stories: {data.length}
              </p>
            </div>
            <div
              className="report-mobile-item"
              style={{ background: "#FF7A09" }}
            >
              <p className="report-mobile-item-total">
                TOTAL Impressions: {totalImpressions()}
              </p>
            </div>
            <div
              className="report-mobile-item"
              style={{ background: "#FF7A09" }}
            >
              <p className="report-mobile-item-total">
                TOTAL Likes: {totalLikes()}
              </p>
            </div>{" "}
            <div
              className="report-mobile-item"
              style={{ background: "#FF7A09" }}
            >
              <p className="report-mobile-item-total">
                TOTAL Followers: {totalFollowers()}
              </p>
            </div>{" "}
            <div
              className="report-mobile-item"
              style={{ background: "#FF7A09" }}
            >
              <p className="report-mobile-item-total">
                TOTAL: {dataPromo ? dataPromo.selectPrice.price : 0}€
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportCampaigns;
