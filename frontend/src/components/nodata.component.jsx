import React from "react";

function NoData({ message }) {
  return (
    <div className="text-center bg-grey/50 rounded-full p-4 w-full">
      <p>{message}</p>
    </div>
  );
}

export default NoData;
