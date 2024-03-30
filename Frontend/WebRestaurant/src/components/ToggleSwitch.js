import React, { useEffect, useState } from "react";

const ToggleSwitch = ({ label, onChange, checked }) => {
  const [isChecked, setIsChecked] = useState(checked ? true : false);

  const toggleChecked = () => {
    onChange(!isChecked);
    setIsChecked((prevState) => !prevState);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <div className="flex items-center">
      <label htmlFor="toggle" className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id="toggle"
            className="sr-only"
            checked={isChecked}
            onChange={toggleChecked}
          />
          <div
            className={`w-12 h-6 ${
              !isChecked ? "bg-gray-400" : "bg-green-500"
            } rounded-full shadow-inner`}
          ></div>
          <div
            className={`absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0 ${
              isChecked ? "transform translate-x-full bg-primary" : ""
            }`}
          ></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">{label}</div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
