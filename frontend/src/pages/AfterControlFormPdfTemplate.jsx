import React, { useEffect, useState } from "react";
import { getAfterControlFormByIdService } from "../Services/afterControlFormService";
import { useParams } from "react-router-dom";
import { Margin, usePDF } from "react-to-pdf";
import { t } from "../utils/translate";
import { useSelector } from "react-redux";
const AfterControlFormPdfTemplate = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { toPDF, targetRef } = usePDF({
    filename: `${id}_control_after_form`,
    page: { margin: Margin.MEDIUM },
  });
  const [complete, setComplete] = useState(0);
  const [isProgress, setIsProgress] = useState(0);
  useEffect(() => {
    getApprovalData();
  }, []);

  const getApprovalData = async () => {
    setIsLoading(true);
    try {
      const response = await getAfterControlFormByIdService(id);
      setData(response?.data);
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  const projectName = data ? data[0]?.projectName : null;
  const dataToSend =
    data?.length > 0 &&
    data?.flatMap((scaffold, index) =>
      scaffold?.afterControl?.map((el, i) => ({
        control: el?.control,
      }))
    );
  useEffect(() => {
    const countYesNo =
      data?.length > 0 &&
      dataToSend?.reduce(
        (count, item) => {
          const control = item?.control?.trim()?.toLowerCase();
          if (control === "yes") {
            count.yes++;
          } else if (control === "no") {
            count.no++;
          }
          return count;
        },
        { yes: 0, no: 0 }
      );

    setComplete(countYesNo.yes);
    setIsProgress(countYesNo.no);
  }, [dataToSend]);
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );
  return (
    <>
      <div className="relative border-2 flex justify-end">
        <button
          className="absolute top-4 right-[100px] flex gap-[10px] mt-[20px] text-[20px] font-[700] hover:bg-[#0072BB] hover:text-[white] transition-all duration-[500ms] ease-in-out cursor- button-text bg-[#0072BB] text-[white] px-[20px] py-[10px] rounded-[5px] mb-[10px]"
          onClick={toPDF}
        >
          {t("DownloadPDF")}
        </button>
      </div>
      <div ref={targetRef} className="m-auto mb-[5rem]">
        <h1 className="text-center text-[40px] my-[20px]">
          After Control From
        </h1>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="custom-container">
            <table className="border-collapse w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">
                    {projectName}
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    {t("Activescaffolds")}
                  </th>
                </tr>
              </thead>
            </table>
            <table className="border-collapse w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-4 py-2">
                    {t("ScaffoldName/type")}
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    {t("ScaffoldID/Number")}
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    {t("Specificlocation")}
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    {t("Control")}
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    {t("LastInspection")}
                  </th>
                  <th className="border border-gray-400 px-4 py-2">
                    {t("AddComment")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((scaffold, index) =>
                  scaffold?.afterControl?.map((el, i) => (
                    <tr
                      key={`${index}-${i}`}
                      className={index % 2 === 0 ? "bg-gray-100" : ""}
                    >
                      <td className="border border-gray-400 px-4 py-2">
                        {el?.scaffoldNamekey}-{el?.scaffoldNameValue}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {el?.scaffoldIdentificationNumber}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {el?.location}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {el?.control}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {new Date(el?.lastInspection).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {el?.comment}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pb-[50px] mt-8">
              <div className="pb-[30px]">
                <p className="medium-title">{t("formDatas")}</p>
              </div>
              <div className="my-[30px]">
                <div className="flex flex-col lg:flex-row w-full">
                  <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                    <div className="flex justify-center items-center p-[20px]">
                      <div className="text-center">
                        <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                          {t("Active-scaffolds")}
                        </p>
                        <p className="medium-title text-[#626262]">
                          {complete}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-[20%] border-b lg:border-b-0 lg:border-r border-[#CCCCCC]">
                    <div className="flex justify-center items-center p-[20px]">
                      <div className="text-center">
                        <p className="medium-title pb-[20px] text-[#0072BB] h-[70px]">
                          {t("Inactive-scaffolds")}
                        </p>
                        <p className="medium-title text-[#626262]">
                          {isProgress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pb-[50px] mt-8">
              <div className="pb-[30px]">
                <p className="medium-title">{t("signature")}</p>
              </div>
              <table className="border border-gray-400 border-collapse">
                <tbody>
                  {data?.map((scaffold, index) => (
                    <>
                      <tr key={index} className="border border-gray-400">
                        <td className="px-4 py-2 border border-gray-400">
                          {t("customerName")}{" "}
                        </td>
                        <td className="px-4 py-2 border border-gray-400">
                          {scaffold?.signature?.customer?.name}
                        </td>
                      </tr>
                      <tr key={index} className="border border-gray-400">
                        <td className="px-4 py-2 border border-gray-400">
                          {t("CustomerSignature")}
                        </td>
                        <td className="px-4 py-2 border border-gray-400">
                          <img src={scaffold?.signature?.customer?.signature} />
                        </td>
                      </tr>
                      <tr key={index} className="border border-gray-400">
                        <td className="px-4 py-2 border border-gray-400">
                          {t("ApproverName")}
                        </td>
                        <td className="px-4 py-2 border border-gray-400">
                          {scaffold?.signature?.approver?.name}
                        </td>
                      </tr>
                      <tr key={index} className="border border-gray-400">
                        <td className="px-4 py-2 border border-gray-400">
                          {t("ApprovalSignature")}
                        </td>
                        <td className="px-4 py-2 border border-gray-400">
                          <img src={scaffold?.signature?.approver?.signature} />
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AfterControlFormPdfTemplate;
