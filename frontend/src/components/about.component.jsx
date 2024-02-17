import React from "react";
import { Link } from "react-router-dom";
import { getDay, getFullDay } from "../common/date";

function AboutUser({ className, bio, socialLinks, joinedAt }) {
  return (<div className={"md:w-[90%] md:mt-7 " + className}>
    <p className="text-xl leading-7">
        {
            bio?.length>0?bio:"Nothing read to here"
        }
    </p>
    <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">

        {
            Object.keys(socialLinks).map((key)=>{
                let link = socialLinks[key];
                if(link.length>0) return <Link key={key}
                target="_blank" to={link}>
                <i className={"fi "+(key!= 'website'? " fi-brands-"+key:"fi-rr-globe")+" text-2xl hover:text-black"}></i>
                </Link>
            })
        }
    </div>
    <p className="text-l leading-7 text-dark-grey ">
Joined on {
    getFullDay(joinedAt)
}
    </p>
  </div>);
}

export default AboutUser;
