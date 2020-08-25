import React from "react";

const Error = () => {
  return (
    <>
      <div className="text-center home py-5">
        <div className="flex w-300 mb-3">
          <img height="30" src="/images/Logo.jpg" className="mr-2" alt="" />
          <h3 className="inlineBlock">
            <strong>FESTAC TECHNOLOGY</strong>
          </h3>
        </div>

        <h1 className="my-3">
          <strong>404 Error</strong>
        </h1>
        <h2>
          <strong>The Page you are looking for doesn't exist</strong>
        </h2>
      </div>
    </>
  );
};

export default Error;
