import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopSection from "../components/forms/TopSection";
import { GoSearch } from "react-icons/go";
import { IoFilter } from "react-icons/io5";
import CurrentProject from "../components/projects/CurrentProject";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import no_data from "../Assets/nodatafound.png";
import {
  getProjectSearchData,
  projectDeleteService,
  projectgetService,
} from "../Services/projectService";
import { toast } from "react-toastify";
import { t } from "../utils/translate";

const Project = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const currentProject = useSelector((store) => store?.project?.project);
  const { id: projectId } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filter, setFilter] = useState("")
  const currentLanguage = useSelector(
    (state) => state?.global?.current_language
  );

  const roleOfUser = useSelector((state) => state?.auth?.loggedInUser?.type);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      delayedAPICall(searchTerm);
    } else {
      setFilteredProjects([]);
    }
    if (!searchTerm) {
      setLoading(false);
    }

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProject();
  }, [filter]);

  async function fetchProject() {
    try {
      setLoading(true);
      const response = await projectgetService(filter);
    } catch (Error) {
      setLoading(false);
      return Error;
    } finally {
      setLoading(false);
    }
  }

  let debounceTimer;

  const delayedAPICall = (term) => {
    setLoading(true);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await getProjectSearchData(term);
        setFilteredProjects(response?.data?.projects);
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleDelete = async (id) => {
    const response = await projectDeleteService(id);
    if (response?.data?.status === "success") {
      await fetchProject();
      toast.success(t("deletedSuccessfully"));
    } else {
      toast.error(t("thereIsSomeError"));
    }
  };

  const refreshtData = async () => {
    await fetchProject(projectId);
  };
  return (
    <>
      <Header />
      <div>
        <TopSection
          title={t("project")}
          breadcrumData={[t("home"), t("hero-button_02")]}
        />
        <div className="pb-[50px] border-b border-b-[#CCCCCC]">
          <div className="custom-container relative">
            <div className="flex  sm:flex-row items-center justify-between text-center">
              <p className="title-text !text-sm sm:!text-xl">
                {t("createYourProjectHere")}
              </p>

              {roleOfUser === 0 || roleOfUser === 1 ? (
                <button className=" bg-[#0072BB] px-2 py-3 rounded-[5px] text-white button-text text-sm text-nowrap">
                  <Link to="/create-project">{t("hero-button_02")}</Link>
                </button>
              ) : null}
            </div>
            <div className="relative w-full mt-4">
              <GoSearch
                className="absolute top-[50%] left-[1%] translate-y-[-50%] "
                size={24}
                color="#000000"
              />
              <input
                onChange={handleSearch}
                className="border"
                placeholder={t("searchProjects")}
                type="text"
              />
              <button>
                <IoFilter
                  className="absolute top-[50%] right-[2%] translate-y-[-50%] "
                  size={24}
                  color="#000000"
                  onClick={() => (setIsFilterOpen(!isFilterOpen))}
                />
              </button>
            </div>
            {isFilterOpen && <ul className="menu bg-base-200 rounded-box absolute right-[25px] w-56">
              <li onClick={() => { setFilter("updatedAt=-1") }}><a>Last Edited</a></li>
              <li onClick={() => { setFilter("createdAt=-1") }}><a>New - Old</a></li>
              <li onClick={() => { setFilter("createdAt=1") }}><a>Old - New</a></li>
            </ul>}
          </div>
        </div>
        <div className="pb-[50px] border-b border-b-[#CCCCCC]">
          <div className="custom-container">
            <div className="mt-[100px]">
              {searchTerm ? (
                <>
                  {loading ? (
                    <>
                      <div className="text-center mt-10 ">
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
                            {t("loading")}
                          </h1>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {filteredProjects?.length > 0 ? (
                        <>
                          <CurrentProject
                            status="active"
                            data={Array.from(
                              new Set(
                                filteredProjects
                                  .filter((item) => item.status === "active")
                                  .map((item) => item._id)
                              )
                            )
                              .map((id) =>
                                filteredProjects.find(
                                  (item) =>
                                    item._id === id && item.status === "active"
                                )
                              )
                              .filter(Boolean)}
                            loading={loading}
                            heading={"Active Project"}
                            handleDelete={handleDelete}
                            refreshtData={refreshtData}
                          />
                          <CurrentProject
                            status="inactive"
                            data={Array.from(
                              new Set(
                                filteredProjects
                                  .filter((item) => item.status === "inactive")
                                  .map((item) => item._id)
                              )
                            )
                              .map((id) =>
                                filteredProjects.find(
                                  (item) =>
                                    item._id === id &&
                                    item.status === "inactive"
                                )
                              )
                              .filter(Boolean)}
                            loading={loading}
                            heading={"Inactive Project"}
                            handleDelete={handleDelete}
                            refreshtData={refreshtData}
                          />
                          <CurrentProject
                            status="completed"
                            data={Array.from(
                              new Set(
                                filteredProjects
                                  .filter((item) => item.status === "completed")
                                  .map((item) => item._id)
                              )
                            )
                              .map((id) =>
                                filteredProjects.find(
                                  (item) =>
                                    item._id === id &&
                                    item.status === "completed"
                                )
                              )
                              .filter(Boolean)}
                            loading={loading}
                            heading={"Completed Project"}
                            handleDelete={handleDelete}
                            refreshtData={refreshtData}
                          />

                        </>
                      ) : (
                        <>
                          <div className="flex justify-center items-center mt-[10px]">
                            <img src={no_data} alt="no data found" />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {loading ? (
                    <>
                      <div className="text-center mt-10 ">
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
                            {t("loading")}
                          </h1>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <>
                        {currentProject?.length > 0 ? (
                          <>
                            <CurrentProject
                              status="active"
                              data={Array.from(
                                new Set(currentProject.map((item) => item._id))
                              )
                                .map((id) =>
                                  currentProject.find(
                                    (item) =>
                                      item._id === id &&
                                      item.status === "active"
                                  )
                                )
                                .filter(Boolean)}
                              loading={loading}
                              heading={t("activeProject")}
                              handleDelete={handleDelete}
                              refreshtData={refreshtData}
                            />
                            <CurrentProject
                              status="completed"
                              data={Array.from(
                                new Set(currentProject.map((item) => item._id))
                              )
                                .map((id) =>
                                  currentProject.find(
                                    (item) =>
                                      item._id === id &&
                                      item.status === "completed"
                                  )
                                )
                                .filter(Boolean)}
                              loading={loading}
                              heading={t("completedProject")}
                              handleDelete={handleDelete}
                              refreshtData={refreshtData}
                            />
                            <CurrentProject
                              status="inactive"
                              data={Array.from(
                                new Set(currentProject.map((item) => item._id))
                              )
                                .map((id) =>
                                  currentProject.find(
                                    (item) =>
                                      item._id === id &&
                                      item.status === "inactive"
                                  )
                                )
                                .filter(Boolean)}
                              loading={loading}
                              heading={t("inactive")}
                              handleDelete={handleDelete}
                              refreshtData={refreshtData}
                            />
                          </>
                        ) : (
                          <>
                            <div className="flex justify-center items-center mt-[10px]">
                              <img src={no_data} alt="no data found" />
                            </div>
                          </>
                        )}
                      </>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Project;
