import React from "react";
import "./message.css";
import moment from "moment";

const Message = ({ user, message, time, classs }) => {
  if (user) {
    return (
      <div className={`messageBox ${classs}`} >
        <div >{`${user}: ${message}`}</div>
        <p className="time">{moment(time).format("ddd, h:mA")}</p>
      </div>
    );
  } else {
    return (
      <div className={`messageBox ${classs} `}>
        <div>{`You: ${message}`}</div>
        <p className="time">{moment(time).format("ddd, h:mA")}</p>
      </div>
    );
  }
};

export default Message;
