import React from "react";

function formatResponse(result) {
  let title = result.Success ? "Success" : "Failed";
  let message = result.Success ? result.Success.NSE.message : result.fault.message;
  let status = result.Success ? "success" : "error";
  return {
    title: title,
    message: message,
    status: status
  };
}

const ToastContext = React.createContext({
  ToastHandler: () => {}
});

export default ToastContext;
export { formatResponse };
