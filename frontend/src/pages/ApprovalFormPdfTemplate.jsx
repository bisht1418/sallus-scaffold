import React, { useEffect, useState } from "react";
import { getApprovalFormByIdService } from "../Services/approvalFormService";
import { useParams } from "react-router-dom";
import { Margin, usePDF } from "react-to-pdf";

const ApprovalFormPdfTemplate = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { approvalId } = useParams();
  const { toPDF, targetRef } = usePDF({
    filename: `${approvalId}_approval_form`,
    page: { margin: Margin.MEDIUM },
  });

  useEffect(() => {
    getApprovalData();
  }, []);

  const getApprovalData = async () => {
    setIsLoading(true);
    try {
      const response = await getApprovalFormByIdService(approvalId);
      setData(response?.data?.data[0]);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center mt-10 flex justify-center place-items-center w-[100vw] h-[100vh]">
          <div
            className="flex flex-col justify-center items-center  gap-[10px]"
            role="status"
          >
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <h1 className="text-[20px] font-[700] text-[#0072BB]">
              Loading...
            </h1>
          </div>
        </div>
      ) : (
        <>
          <div className="relative border-2 flex justify-end">
            <button
              className="absolute top-4 right-[100px] flex gap-[10px] mt-[20px] text-[20px] font-[700] hover:bg-[#0072BB] hover:text-[white] transition-all duration-[500ms] ease-in-out cursor- button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px] mb-[10px]"
              onClick={toPDF}
            >
              Download PDF
            </button>
          </div>

          <div ref={targetRef} className="m-auto mb-[5rem]">
            <h1 className="text-center text-[40px] my-[20px]">Approval Form</h1>
            <table
              className="text-[30px] table-style"
              style={{
                width: "90%",
                margin: "auto",
                borderCollapse: "collapse",
                backgroundColor: "#fff",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <thead>
                <tr>
                  <th className="table-header">Field Name</th>
                  <th className="table-header">Value</th>
                </tr>
              </thead>

              <tbody>
                {Object.keys(data).map(
                  (key, index) =>
                    key !== "isDeleted" &&
                    key !== "__v" &&
                    data[key] !== null &&
                    data[key] !== undefined &&
                    data[key] !== "null" && (
                      <tr
                        key={key}
                        className={index % 2 === 0 ? "even-row" : "odd-row"}
                      >
                        <td className="table-cell">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase()) === "_id"
                            ? "id"
                            : key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                        </td>
                        <td className="table-cell">
                          {key === "inspectorSignature" ||
                            key === "customerSignature" ||
                            key.includes("File") ||
                            key.includes("Image") ? (
                            key.includes("File") || key.includes("Image") ? (
                              <>
                                {(() => {
                                  const fileExtension = data[key]
                                    .split(".")
                                    .pop();
                                  if (
                                    fileExtension === "jpg" ||
                                    fileExtension === "png"
                                  ) {
                                    return (
                                      <a
                                        className="signature-link"
                                        href={`${data[key]}`}
                                        target="_blank"
                                      >
                                        View Image
                                      </a>
                                    );
                                  } else {
                                    return (
                                      <a
                                        className="signature-link"
                                        href={`${data[key]}`}
                                        target="_blank"
                                      >
                                        View PDF
                                      </a>
                                    );
                                  }
                                })()}
                              </>
                            ) : (
                              <>
                                <img
                                  className="signature-image"
                                  src={data[key]}
                                  target="_blank"
                                  alt={data[key]}
                                />
                              </>
                            )
                          ) : (
                            <>
                              {key === "scaffoldName" ||
                                key === "sizeScaffold" ? (
                                <div>
                                  {data[key].map((item, index) => (
                                    <div key={index}>
                                      <span>{item.value}: </span>
                                      <span>{item.key}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <>{data[key]}</>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default ApprovalFormPdfTemplate;
