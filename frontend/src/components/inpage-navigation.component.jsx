import React, { useEffect, useRef, useState } from "react";
export let activeTabRef;
export let activeTabLineRef;
function InPageNavigation({
  routes,
  defaultIndex = 0,
  defaultHidden = [],
  children,
}) {
  let [inPageNavIndex, setInPageNavIndex] = useState(0);
  activeTabLineRef = useRef(null);
  activeTabRef = useRef(null);
  const chnagePageState = (btn, index) => {
    let { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";
    setInPageNavIndex(index);
  };

  useEffect(() => {
    chnagePageState(activeTabRef.current, defaultIndex);
  }, []);
  return (
    <>
      <div className="realtive mb-8 bg-white border-b border-grey flex-nowrap overflow-x-auto">
        {routes.map((route, i) => {
          return (
            <button
              ref={i == defaultIndex ? activeTabRef : null}
              key={i}
              className={
                "p-4 px-5 capitalize " +
                (inPageNavIndex == i ? "text-black " : "text-dark-grey ") +
                (defaultHidden.includes(route) ? " md:hidden " : "")
              }
              onClick={(e) => {
                chnagePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}
        <hr ref={activeTabLineRef} className="absolute bottom- duration-300" />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
}

export default InPageNavigation;
