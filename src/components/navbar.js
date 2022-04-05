import React, { useState } from "react";

const Navbar = (props) => {
  const { title } = props;

  return (
    <>
      <div className="row bg-dark px-3" id="nav">
        <div className="col-md-4">
          <a
            href="https://dandelionlabs.io/"
            alt="Linear Token Vesting"
            target="_blank"
          >
            <img
              src="images/logo.png"
              alt="Dandelion Labs - Linear Token Vesting"
            />
          </a>
        </div>
        <div className="col-md-4">
          <h4 className="text-center font-weight-bold">
            <strong style={{ color: "white" }}>{title}</strong>
          </h4>
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary float-end" id="btn-connect">
            Connect Wallet
          </button>
          <button
            className="btn btn-warning float-end"
            id="btn-disconnect"
            style={{ display: "none" }}
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
