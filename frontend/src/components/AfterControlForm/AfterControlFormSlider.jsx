import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { t } from "../../utils/translate";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";

const AfterControlFormSlider = ({
  data,
  handleToggleDropdown,
  roleOfUser,
  handleDelete,
  dropdownVisible,
  currentId,
  handleSelect,
  status,
  isStatus,
  visibleItems,
  handleViewMore,
}) => {
  const navigate = useNavigate();
  const handelClick = (id, pId) => {
    navigate(`/edit-control-form-after/${pId}/${id}`);
  };
  function formatDateTime(dateTimeStr) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <>
      <div className="custom-container">
        {data.length > 0 && (
          <>
            <div className="flex justify-between gap-4 items-center py-[50px]">
              {status === "Inprogress After Control Form" ? (
                <div className="flex sm:items-center justify-between gap-2 w-full flex-col sm:flex-row">
                  <p
                    className="medium-title"
                    style={{
                      color: "#212121",
                    }}
                  >
                    {" "}
                    {t("InprogressControlFormList")}
                  </p>
                  <div className="relative">
                    <div
                      className="flex justify-between rounded-[5px] items-center gap-[10px] lg:gap-[30px] px-[10px] py-[14px] bg-[white]"
                      style={{ border: "1px solid #ccc" }}
                    >
                      <p className="project-number leading-0">
                        {t("projectNumber")}
                      </p>
                      <input
                        className="medium-title leading-0 outline-none w-[125px]"
                        value={data[0]?.projectId?.projectNumber}
                      />
                    </div>
                  </div>
                </div>
              ) : status === "Completed After Control Form" ? (
                <>
                  <p
                    className="medium-title"
                    style={{
                      color: "#212121",
                    }}
                  >
                    {t("CompletedControlFormList")}
                  </p>
                </>
              ) : null}
            </div>
          </>
        )}

        <div className="max-w-[1150px] min-h-[100px] ">
          {data.length > 0 && (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border-b-[2px] border-b-[#CCCCCC] border-solid px-5 py-2 text-left whitespace-nowrap min-w-12"></th>
                  <th className="border-b-[2px] border-b-[#CCCCCC] border-solid px-5 py-2 text-left whitespace-nowrap min-w-[180px]">
                    <p className="service-description">
                      {t("afterControlForm")}
                    </p>
                  </th>
                  <th className="border-b-[2px] border-b-[#CCCCCC] border-solid px-5 py-2 text-left whitespace-nowrap min-w-20">
                    <p className="service-description">{"Re-check"}</p>
                  </th>
                  <th className="border-b-[2px] border-b-[#CCCCCC] border-solid px-5 py-2 text-left whitespace-nowrap min-w-20">
                    <p className="service-description">{"Date of control"}</p>
                  </th>
                  <th className="border-b-[2px] border-b-[#CCCCCC] border-solid px-5 py-2 text-left whitespace-nowrap min-w-12"></th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  <>
                    {data?.slice(0, visibleItems)?.map((item, index) => (
                      <tr>
                        <td className="px-5 py-2 text-left">
                          <div className="h-[40px] flex justify-center items-center min-w-[50px] lg:min-w-[80px]">
                            <input
                              onChange={(e) => {
                                handleSelect(item._id, e.target.checked);
                              }}
                              type="checkbox"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-2 text-left">
                          <p
                            className="service-description"
                            onClick={() =>
                              handelClick(item?._id, item?.projectId?._id)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {item?.projectName}
                          </p>
                        </td>
                        <td className="px-5 py-2 text-left whitespace-nowrap">
                          <p className="service-description">
                            {formatDateTime(item?.updatedAt)}
                          </p>
                        </td>
                        <td className="px-5 py-2 text-left whitespace-nowrap">
                          <p className="service-description">
                            {formatDateTime(item?.updatedAt)}
                          </p>
                        </td>
                        <td className="px-5 py-2 text-left">
                          <button className="relative">
                            {item.isSelected ? (
                              <BsTrash3
                                id={index}
                                onClick={() => handleDelete(item?._id)}
                                color="#FF4954"
                                size={20}
                              />
                            ) : (
                              <>
                                <MdOutlineMoreHoriz
                                  id={index}
                                  onClick={(event) =>
                                    handleToggleDropdown(
                                      index,
                                      event,
                                      item?.isCompleted
                                    )
                                  }
                                  size={20}
                                />
                                {dropdownVisible &&
                                  currentId === index &&
                                  item?.isCompleted === isStatus && (
                                    <div className="top-[100%] z-10	 absolute right-[0px] z-99999 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                      {roleOfUser === 0 && (
                                        <>
                                          <button
                                            onClick={() =>
                                              handleDelete(item._id)
                                            }
                                            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none"
                                          >
                                            {t("delete")}
                                          </button>
                                          {roleOfUser === 0 ||
                                          roleOfUser === 1 ? (
                                            <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded focus:outline-none">
                                              <Link
                                                to={`/edit-control-form-after/${item?.projectId?._id}/${item?._id}`}
                                              >
                                                {t("edit")}
                                              </Link>
                                            </button>
                                          ) : null}
                                        </>
                                      )}
                                    </div>
                                  )}
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <p className="service-description">Data not found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="pt-[30px] flex justify-center">
        {visibleItems < data?.length && (
          <button
            onClick={() => handleViewMore(data[0]?.isCompleted)}
            className="border border-[black] rounded-[5px] px-[20px] py-[10px] button-text"
          >
            {t("ViewMore")}
          </button>
        )}
      </div>
    </>
  );
};

export default AfterControlFormSlider;
