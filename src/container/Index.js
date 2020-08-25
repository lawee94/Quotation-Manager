import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <div className="text-center home py-5">
        <div className="flex w-300 mb-3">
          <img height="30" src="/images/Logo.jpg" className="mr-2" alt="" />
          <h3 className="inlineBlock">
            <strong>FESTAC TECHNOLOGY</strong>
          </h3>
        </div>

        <h3>
          <strong>Quotation Manager</strong>
        </h3>
        <div className="auth-container p-0">
          <div className="row">
            <div className="p-5 col-sm-6 ">
              <h4>
                <strong>
                  Try our quotation manager, for free by creating an account
                </strong>
              </h4>
              <p>Create a brand-new account for you quotation.</p>
              <Link to="/register" target="_blank">
                <button className="btn btn-primary my-2">
                  <strong>+ Create an Account</strong>
                </button>
              </Link>
            </div>
            <div className="bg-lg p-5 col-sm-6 ">
              <h4>
                <strong>
                  Did you already have a quotation manager account?
                </strong>
              </h4>
              <p>Find or signin to your quotation account.</p>
              <Link to="/login" target="_blank">
                <button className="btn btn-primary my-2">
                  <strong>Sign in --></strong>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
