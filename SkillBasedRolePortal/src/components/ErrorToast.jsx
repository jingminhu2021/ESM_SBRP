import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ErrorToast = ({ message }) => {
  return (
    <div>
      {message}
    </div>
  );
};

const showErrorToast = (message) => {
  toast.error(<ErrorToast message={message} />, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 5000, // Auto-close the popup after 5 seconds
  });
};

export default showErrorToast;
