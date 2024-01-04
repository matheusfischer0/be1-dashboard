import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center bg-white p-12">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Loading;
