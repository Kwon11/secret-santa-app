"use strict";
import { connect } from "react-redux";
import { facebook } from "../actions/actions.js";
import React from 'react';

const Facebook = ({ dispatch }) => (
  <div
    className="GroupSelector"
    onClick={ev => {
      ev.preventDefault();
      loginFacebook(dispatch);
    }}
  >
    Facebook
  </div>
);

const loginFacebook = (dispatch) => {
  FB.getLoginStatus(response => {
    if (response.status === "connected") {
      console.log('connected', response);
      dispatch(facebook(response));
    } else {
      FB.login(response => {
        if (response.authSuccess) {
          console.log('not connected', response)
          dispatch(facebook(response));
        }
      }, { scope: "email,public_profile", info_fields: "email,name" });
    }
  });
};

export default connect()(Facebook)