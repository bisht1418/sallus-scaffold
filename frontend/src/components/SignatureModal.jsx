import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import SignatureCanvas from "react-signature-canvas";

Modal.setAppElement("#root");

function SignatureModal({ isOpen, onClose, onSave, formCategory, inspector }) {
  const signatureRef = useRef();
  const [nameError, setNameError] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    setName(inspector || "");
  }, [inspector]);
  const validateName = (name) => {
    if (formCategory === "risk-job-analysis") {
      return true;
    }

    const containsNumber = /\d/.test(name);
    if (name.trim() === "") {
      setNameError("Name is required");
      return false;
    } else if (containsNumber) {
      setNameError("Name should not contain numbers");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleSave = () => {
    if (signatureRef.current.isEmpty()) {
      return;
    }
    if (validateName(name)) {
      const signatureDataUrl = signatureRef.current.toDataURL();
      onSave(signatureDataUrl, name);
      setName(inspector || "");
      onClose();
    }
  };

  const customModalStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "calc(100% - 30px)",
      maxWidth: 700, // Adjust the maximum width as needed
      backgroundColor: "white",
      border: "1px solid #ccc",
      padding: 20,
      borderRadius: 4,
      height: "600px",
    },
  };

  return (
    // <div className='flex justify-center items-center '>
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customModalStyles}>
      <div className="justify-center items-center">
        <div className="flex sm:flex-nowrap flex-wrap sm:gap-5 gap-2 sm:mt-8">
          <label>Signature</label>
          <div className="border border-[#D3D3D3] rounded-[5px] overflow-hidden">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{ width: 550, height: 300 }}
              backgroundColor="white"
              penColor="#0072BB"
              style={{ fontSize: "48px" }}
            />
          </div>
        </div>
        {formCategory !== "risk-job-analysis" && (
          <>
            <div className="flex sm:flex-nowrap flex-wrap sm:mt-8 mt-4 sm:gap-12 gap-2">
              <label>Name</label>
              <input
                className="input-without-icon"
                type="text"
                placeholder="Enter Name "
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="text-[red] text-[14px] font-[400] sm:mx-[100px]">
              {nameError}
            </div>
          </>
        )}
        <div className="flex justify-center">
          <button
            className="button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px] sm:mt-11 mt-6"
            onClick={handleSave}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>

    // </div>
  );
}

export default SignatureModal;
