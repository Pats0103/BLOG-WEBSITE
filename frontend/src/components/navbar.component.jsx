import { useContext, useState } from "react";
import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
const Navbar = () => {
  const navigate = useNavigate();
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel , setUserNavPanel] = useState(false)
  const {
    userAuth,
    userAuth: { access_token, profile_img },
    setUserAuth,
  } = useContext(UserContext);

  const handleSearch = (e) => {
    let search = e.target.value;
    if (e.key === "Enter"&&search!=="") {
      navigate(`/search/${search}`);
    }
  }
  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="logo" className="w-9" />
        </Link>
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:relative md:inset-0 md:block md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search "
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey  md:pl-12"
            onKeyDown={handleSearch}
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto ">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((prev) => !prev)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit text-xl"></i>
            <p>write</p> 
          </Link>
          {access_token ? (
            <>
              <Link to="/dashboard/notification">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-xl block mt-1"></i>
                </button>
              </Link>
              <div className="relative" onBlur={()=>setTimeout(() => {
                setUserNavPanel(prev=>!prev)
              }, 200)}>
                <button className="w-12 h-12 mt-1" 
                onClick={()=>setUserNavPanel(prev=>!prev) 
                
                }
                >
                  <img
                    src={profile_img}
                    alt=""
                    className="w-full object-cover h-full"
                  />
                </button>

              { userNavPanel? <UserNavigationPanel />:""}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2 " to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
