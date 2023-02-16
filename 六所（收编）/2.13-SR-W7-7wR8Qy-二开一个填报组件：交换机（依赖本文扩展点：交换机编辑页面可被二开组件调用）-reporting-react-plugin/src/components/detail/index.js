import React from "react";
import PropTypes from "prop-types";

const Detail = ({ data, formConfig }) => {
  return (
    <>
      <div>{data}</div>
    </>
  );
};

Detail.propTypes = {
  data: PropTypes.string
};

export default Detail;
