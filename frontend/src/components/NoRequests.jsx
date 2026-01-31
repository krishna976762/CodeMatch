import React from "react";

const NoRequests = ({ gender }) => {
  const imageSrc =
    gender === "male"
      ? "/images/noConnectionMale.png"
      : gender === "female"
      ? "/images/noConnectionFemale.png"
      : "/images/noConnection.png";

  return (
    <div className="flex flex-col items-center">
      <img 
        alt="No Requests" 
        src={imageSrc} 
        className="max-w-[28%] h-auto mb-4" 
      />
      <h1 className="text-white text-center text-lg">No Requests Found</h1>
    </div>
  );
};

export default NoRequests;
