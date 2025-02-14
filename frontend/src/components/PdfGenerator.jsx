import React, { useState } from "react";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

const PdfGenerator = ({ isSafeJobAnalysis, children, isObservation }) => {
  const [loading, setLoading] = useState(false);

  const generatePdf = async (dataUrl) => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const img = new Image();
      img.src = dataUrl;

      img.onload = function () {
        const imgWidth = 210;
        const imgHeight = (img.height * imgWidth) / img.width;
        let position = 0;

        pdf.addImage(
          dataUrl,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          "",
          "FAST"
        );
        position -= pdf.internal.pageSize.height;

        while (position > -imgHeight) {
          pdf.addPage();
          pdf.addImage(
            dataUrl,
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight,
            "",
            "FAST"
          );
          position -= pdf.internal.pageSize.height;
        }

        pdf.save("download.pdf");
        setLoading(false);
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Handle error here
      setLoading(false);
    }
  };

  const handleGeneratePdf = () => {
    setLoading(true);
    const input = document.getElementById("pdf-content");

    domtoimage
      .toPng(input)
      .then(function (dataUrl) {
        generatePdf(dataUrl);
      })
      .catch(function (error) {
        console.error("Error generating PDF:", error);
        setLoading(false);
      });
  };

  const downloadPdf = () => {
    handleGeneratePdf();
  };

  return (
    <div className="relative my-5">
      <div id="pdf-content">{children}</div>

      <div
        className={`flex justify-center gap-10 absolute  ${
          isSafeJobAnalysis
            ? "top-[-40px] sm:top-0 right-10"
            : isObservation
            ? "top-[-40px] sm:top-0 right-10"
            : "top-20 right-[20%]"
        } `}
      >
        <button
          onClick={downloadPdf}
          className={`block bg-[#0072bb] px-4 py-2 text-left text-white hover:bg-[#005388] rounded focus:outline-none`}
        >
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default PdfGenerator;
