import React from "react";

const ToastContext = React.createContext({
  ToastHandler: () => {},
});

export default ToastContext;
