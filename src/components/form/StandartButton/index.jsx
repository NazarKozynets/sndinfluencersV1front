import React from "react";
import styles from "./style.module.css";

const StandartButton = ({ onClick, text = "", style }) => {
  return (
    <button
      type="button"
      style={style}
      className={styles.button}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default StandartButton;
