import React, { useContext, useRef } from "react";
import InputBox from "../components/input.component";
import GoogleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import {Toaster, toast} from 'react-hot-toast';
import axios from 'axios'
import { AnimateSharedLayout } from "framer-motion";
import AnimationWrapper from "../common/page-animation";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";

function UserAuthForm({ type }) {
  const authForm = useRef(null);

  let {userAuth:{access_token} , setUserAuth} = useContext(UserContext)

  const userAuthThroughServer=(serverRoute ,formData)=>{
    axios.post(serverRoute, formData).then(({data})=>{

      toast.success(data.message)
      
      storeInSession("user", JSON.stringify(data.data))
      setUserAuth(data.data)
    }
    ).catch(({response})=>{
      toast.error(response.data.message)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

   let serverRoute =  type == "sign-in" ? "/api/signin" : "/api/signup";

    const form = new FormData(authForm.current);
    let formData = {};

    for (let [name, value] of form.entries()) {
      formData[name] = value;
    }

    //validate the form
    if (type == "sign-in") {
      if (!formData.email || !formData.password) {
        return toast.error("Please fill in all fields");
      }


    } else {
      if (!formData.fullname || !formData.email || !formData.password) {
        return toast.error("Please fill in all fields");
      }
    }

      userAuthThroughServer(serverRoute ,formData)

  };

  return (
   <>
  {
    access_token? <Navigate to={"/"}/>: <AnimationWrapper keyValue={type} childern={<section className="h-cover flex items-center justify-center">
    <Toaster />
    <form action="" className="w-[80%] max-w-[400px]" ref={authForm}>
      <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
        {type == "sign-in" ? "welcome back" : "join us today"}
      </h1>

      {type != "sign-in" ? (
        <InputBox
          name="fullname"
          type="text"
          placeholder={"Full Name"}
          icon={"fi-rr-user"}
        />
      ) : (
        ""
      )}

      <InputBox
        name="email"
        type="email"
        placeholder={"email"}
        icon={"fi-rr-at"}
      />
      <InputBox
        name="password"
        type="password"
        placeholder={"password"}
        icon={"fi-rr-lock"}
      />

      <button
        className="btn-dark center w-full mt-14 "
        type="submit"
        onClick={handleSubmit}
      >
        {type.replace("-", " ")}
      </button>

      <div className="w-full items-center  justify-center flex relative gap-2 my-10 opacity-10  uppercase text-black font-bold">
        <hr className="border-black w-full " />
      </div>

      <button className="btn-dark flex items-center justify-center gap-4 w-[100%] center">
        <img src={GoogleIcon} alt="" className="w-6" />
        continue with google
      </button>
      {type == "sign-in" ? (
        <p className="mt-6 text-dark-grey text-xl text-center">
          Dont have an account?
          <Link to="/signup" className="underline text-black text-xl ml-1">
            singup
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-dark-grey text-xl text-center">
          already have an account?
          <Link to="/signin" className="underline text-black text-xl ml-1">
            signin
          </Link>
        </p>
      )}
    </form>
  </section>}>

</AnimationWrapper>
  }

   
    </>
  );
}

export default UserAuthForm;
