import { ToyBrick } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function InputBox({ name, type, id, value, placeholder, icon }) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <>
      <div className="relative w-[100%] mb-4">
        <input
          name={name}
          type={
            type == "password" ? (showPassword ? "text" : "password") : type
          }
          id={id}
          defaultValue={value}
          placeholder={placeholder}
          className="input-box"
        />
        <i className={"fi " + icon + " input-icon"}></i>{" "}
        {type == "password" ? (
          <i
            className={
              "fi fi-rr-eye" +
              (!showPassword ? "-crossed" : "") +
              " input-icon left-[auto] right-4 cursor-pointer"
            }
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        ) : (
          ""
        )}

       
      </div>
    </>
  );
}

export default InputBox;
