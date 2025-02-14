import React from "react";
import { Routes, Route } from "react-router-dom";

import Forms from "../pages/Forms";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

import Project from "../pages/Project";

import HomePage from "../pages/HomePage";
import Users from "../Admin/Pages/Users";

import AboutPage from "../pages/AboutPage";
import FilesPage from "../pages/FilesPage";
import PrivateRoute from "./PrivateRoutes";

import SjaForms from "../Admin/Pages/SjaForm";

import SupportPage from "../pages/SupportPage";
import LandingPage from "../pages/LandingPage";
import AllUsers from "../Admin/Pages/AllUsers";
import AllAdmin from "../Admin/Pages/AllAdmin";
import AllForms from "../Admin/Pages/AllForms";
import SearchEmail from "../pages/SearchEmail";

import MaterialList from "../pages/MaterialList";
import ServiceForms from "../pages/ServiceForms";
import ServicesPage from "../pages/ServicesPage";
import PicturesPage from "../pages/PicturesPage";
import PageNotFound from "../pages/PageNotFound";

import ContactUsPage from "../pages/ContactUsPage";
import CreateProject from "../pages/CreateProject";
import AdminLogin from "../Admin/Pages/AdminLogin";
import PaymentCancel from "../pages/PaymentCancel";

import AdminSignUp from "../Admin/Pages/AdminSignUp";
import ForgetPassword from "../pages/ForgetPassword";
import PaymentSuccess from "../pages/PaymentSuccess";
import ObservationPdf from "../pages/ObservationPdf";
import AllProjects from "../Admin/Pages/AllProjects";

import Calendar from "../components/projects/Calendar";
import ObservationForm from "../pages/ObservationForm";
import OtpVerification from "../pages/OtpVerification";

import Invite from "../components/createProject/Invite";
import ApprovalForms from "../Admin/Pages/ApprovalForm";

import EditMaterialList from "../pages/EditMaterialList";

import AdminDashboard from "../Admin/Pages/AdminDashboard";

import AfterControl from "../components/forms/AfterControl";

import SafeJobAnalysisPdf from "../pages/SafeJobAnalysisPdf";

import ObservationForms from "../Admin/Pages/ObservationForm";

import ViewUsersDetails from "../Admin/Pages/ViewUsersDetails";
import MaterialListingPage from "../pages/MaterialListingPage";
import ApprovalListingPage from "../pages/ApprovalListingPage";
import SafeJobAnalysisForm from "../pages/SafeJobAnalysisForm";
import EditSafeJobAnalysis from "../pages/EditSafeJobAnalysis";
import SubscriptionList from "../Admin/Pages/SubscriptionList";

import AfterControlForms from "../Admin/Pages/AfterControlForm";
import MaterialListForms from "../Admin/Pages/MaterialListForm";

import DashboardHomePage from "../Admin/Pages/DashboardHomePage";
import ObservationListing from "../pages/ObservationListingPage";

import ApprovalFormPdf from "../components/forms/ApprovalFormPdf";

import AddNewUserFormPage from "../Admin/Pages/AddNewUserFormPage";

import AfterControlForm from "../components/forms/AfterControlForm";
import EditApprovalForm from "../components/forms/EditApprovalForm";
import EditAfterControl from "../components/forms/EditAfterControl";

import SafeJobAnalysisListing from "../pages/SafeJobAnalysisListing";
import EditObservationListing from "../pages/EditObservationListing";

import SubscriptionPageDetails from "../pages/SubscriptionPageDetails";
import InviteUserForProject from "../Admin/Pages/InviteUserForProject";
import ApprovalFormPdfTemplate from "../pages/ApprovalFormPdfTemplate";

import MySubscriptionPlanDetail from "../pages/MySubscriptionPlanDetail";
import InvitedUserForProject from "../Admin/Pages/InvitedUserForProject";

import EditAfterControlForm from "../components/forms/EditAfterControlForm";

import EditCreateProject from "../components/createProject/EditCreateProject";

import AfterControlFormPdfTemplate from "../pages/AfterControlFormPdfTemplate";

import TermAndConditionForSubscription from "../pages/TermAndConditionForSubscription";

import AfterControlFormListingPage from "../components/forms/AfterControlFormListingPage";
import ViewProjectDetails from "../Admin/Pages/ViewProjectDetails";
import VisitorList from "../Admin/Pages/VisitorList";
import VolumePage from "../components/createProject/volumeBased";
import RentalPage from "../components/createProject/rentalBased";
import ScaffoldPricing from "../components/createProject/PricePage/ScaffoldPricing";
import { RentalBasePage } from "../components/createProject/RentalBase/RentalBasePage";
import TermsAndConditions from "../pages/TermsAndConditions";
import PaymentStatus from "../components/PaymentStatus";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/volume/:projectId" element={<VolumePage />} />
      <Route path="/rental/:projectId" element={<RentalBasePage />} />
      <Route path="/price/:projectId" element={<ScaffoldPricing />} />
      <Route
        path="/project/invite/:id/:status/:userid/:type/:projectId"
        element={<Invite />}
      />
      <Route path="/*" element={<PageNotFound />} />
      <Route path="/approval-form-pdf/:id" element={<ApprovalFormPdf />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/approval-form/:id"
        element={
          <PrivateRoute>
            <Forms />
          </PrivateRoute>
        }
      />
      <Route
        path="/after-control-form/:id"
        element={
          <PrivateRoute>
            <AfterControlForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-project"
        element={
          <PrivateRoute path="/create-project">
            <CreateProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/project"
        element={
          <PrivateRoute path="/project">
            <Project />
          </PrivateRoute>
        }
      />
      <Route
        path="/material-list/:projectId"
        element={
          <PrivateRoute>
            <MaterialList />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-material-list/:projectId/:materialId"
        element={
          <PrivateRoute>
            <EditMaterialList />
          </PrivateRoute>
        }
      />
      <Route
        path="/servicesforms"
        element={
          <PrivateRoute>
            <ServiceForms />
          </PrivateRoute>
        }
      />
      <Route
        path="/services"
        element={
          <PrivateRoute>
            <ServicesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/safe-job-analysis/:projectId"
        element={
          <PrivateRoute>
            <SafeJobAnalysisForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/safe-job-analysis-listing/:projectId"
        element={
          <PrivateRoute>
            <SafeJobAnalysisListing />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-safe-job-analysis/:projectId/:safeJobAnalysisId"
        element={
          <PrivateRoute>
            <EditSafeJobAnalysis />
          </PrivateRoute>
        }
      />
      <Route
        path="/observation/:projectId"
        element={
          <PrivateRoute>
            <ObservationForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/observation-listing/:projectId"
        element={
          <PrivateRoute>
            <ObservationListing />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-Observation-listing/:projectId/:observationId"
        element={
          <PrivateRoute>
            <EditObservationListing />
          </PrivateRoute>
        }
      />
      <Route
        path="/files/:projectId"
        element={
          <PrivateRoute>
            <FilesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pictures/:projectId"
        element={
          <PrivateRoute>
            <PicturesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/approval-listing-page/:id"
        element={
          <PrivateRoute>
            <ApprovalListingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/material-listing-page/:projectId"
        element={
          <PrivateRoute>
            <MaterialListingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-create-project/:id"
        element={
          <PrivateRoute>
            <EditCreateProject />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-approval-form/:id"
        element={
          <PrivateRoute>
            <EditApprovalForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/after-control-listing-form/:id"
        element={
          <PrivateRoute>
            <AfterControlFormListingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-after-control-listing-form/:approvalId/:controlFormId"
        element={
          <PrivateRoute>
            <EditAfterControlForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/approval-form/pdf/:approvalId"
        element={
          <PrivateRoute>
            <ApprovalFormPdfTemplate />
          </PrivateRoute>
        }
      />
      <Route path="/calendar/:id" element={<Calendar />} />
      <Route
        path="/control-form-after/:id"
        element={
          <PrivateRoute>
            <AfterControl />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-control-form-after/:projectId/:afterControlId"
        element={
          <PrivateRoute>
            <EditAfterControl />
          </PrivateRoute>
        }
      />
      <Route
        path="/after-control-form/pdf/:id"
        element={
          <PrivateRoute>
            <AfterControlFormPdfTemplate />
          </PrivateRoute>
        }
      />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/search-email" element={<SearchEmail />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/cancel" element={<PaymentCancel />} />
      <Route path="/subscription" element={<SubscriptionPageDetails />} />
      <Route path="/my-subscription" element={<MySubscriptionPlanDetail />} />
      <Route
        path="/safe-job-analysis-pdf/:projectId/:safeJobAnalysisId"
        element={<SafeJobAnalysisPdf />}
      />
      <Route
        path="/observation-pdf/:projectId/:observationId"
        element={<ObservationPdf />}
      />
      <Route
        path="/term-and-condition"
        element={<TermAndConditionForSubscription />}
      />
       <Route
        path="/terms-and-conditions-summary"
        element={<TermsAndConditions />}
      />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<AdminSignUp />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route
        path="/admin-dashboard/home-page"
        element={<DashboardHomePage />}
      />
      <Route path="/admin-dashboard/user/all-users" element={<AllUsers />} />
      <Route path="/admin-dashboard/user/all-admin" element={<AllAdmin />} />
      <Route path="/admin-dashboard/user/users" element={<Users />} />
      <Route
        path="/admin-dashboard/user/add-new-user"
        element={<AddNewUserFormPage />}
      />
      <Route
        path="/admin-dashboard/user/view-user-details/:id"
        element={<ViewUsersDetails />}
      />
      <Route
        path="/admin-dashboard/project/all-projects"
        element={<AllProjects />}
      />
      <Route
        path="/admin-dashboard/user/view-project-details/:projectDetail"
        element={<ViewProjectDetails />}
      />
      <Route
        path="/admin-dashboard/project/invite-user"
        element={<InviteUserForProject />}
      />
      <Route
        path="/admin-dashboard/project/invited-user"
        element={<InvitedUserForProject />}
      />
      <Route path="/admin-dashboard/form/all-forms" element={<AllForms />} />
      <Route
        path="/admin-dashboard/form/approval-forms"
        element={<ApprovalForms />}
      />
      <Route path="/admin-dashboard/form/SJA-forms" element={<SjaForms />} />
      <Route
        path="/admin-dashboard/form/after-control-forms"
        element={<AfterControlForms />}
      />
      <Route
        path="/admin-dashboard/form/observation-forms"
        element={<ObservationForms />}
      />{" "}
      <Route
        path="/admin-dashboard/form/material-list-forms"
        element={<MaterialListForms />}
      />
      <Route
        path="/admin-dashboard/subscription-list-forms"
        element={<SubscriptionList />}
      />
      <Route path="/admin-dashboard/visitor" element={<VisitorList />} />
      <Route path="/payment-status" element={<PaymentStatus />} />
    </Routes>
  );
};
// vercel Comment
export default AllRoutes;
