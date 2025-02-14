import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { t } from "../utils/translate";
import FooterIndex from "./Footer/FooterIndex"

const Footer = () => {
  return (
    <div className="">  
      <FooterIndex />
    </div>
  )
}

export default Footer