require("dotenv").config();
var cors = require("cors");
const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const { connectDB } = require("./db/mongoose");
const fileRoute = require("./routes/fileRoute");
const userRouter = require("./routes/userRoutes");
const inviteRoute = require("./routes/inviteRoute");
const PaymentRoute = require("./routes/paymentRoute");
const adminAuthRouter = require("./routes/adminAuth");
const projectRoute = require("./routes/projectRoute");
const downloadRoute = require("./routes/downloadRoute");
const AllFormRouter = require("./routes/allFormsRoute");
const ContactUsForm = require("./routes/contactUsRoute");
const calendarNotesRoute = require("./routes/calenderRoute");
const MaterialRoute = require("./routes/customMaterialRoute");
const ScaffoldLogRouter = require("./routes/scaffoldLogRoute");
const AfterControlForm = require("./routes/afterControlRoute");
const observationRoute = require("./routes/observationRoutes");
const ApprovalFormRoute = require("./routes/approvalFormRoute");
const SubscriptionRoute = require("./routes/subscriptionRoute");
const imagesController = require("./controller/imageController");
const Material_listRoute = require("./routes/material_listRoute");
const ActionNotificationRoute = require("./routes/actionLogsRoute");
const safeJobAnalysisRoute = require("./routes/safeJobAnalysisRoute");
const AfterControlFormRoute = require("./routes/afterControlFormRoute");
const SubscriptionPlanRoute = require("./routes/subscriptionPlanRoute");
const CustomNotificationRoute = require("./routes/customNotificationRoute");
const MaterialListWithProject = require("./routes/materialListWithProjectRoute");
const AfterControlVisualInspectionForm = require("./routes/afterControlVisulaInspectionRoutes");
const updateProfileRoute = require('./routes/userRoutes'); // Adjust path as needed
const {
  initializeDeactivationSchedules,
  deactivateExpiredAccounts,
} = require("./controller/userController");
const visitorRouter = require("./routes/visitorRoute");
const priceFormRoute = require("./routes/priceRoute");

connectDB();
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(userRouter);
app.use(PaymentRoute);
app.use(SubscriptionRoute);
app.use("/file", fileRoute);
app.use(SubscriptionPlanRoute);
app.use("/invite", inviteRoute);
app.use("/project", projectRoute);
app.use("/admin", adminAuthRouter);
app.use("/visitor", visitorRouter);
app.use("/all-form", AllFormRouter);
app.use('/api', updateProfileRoute);
app.use("/download", imagesController);
app.use('/price-form', priceFormRoute);
app.use("/observation", observationRoute);
app.use("/download-files", downloadRoute);
app.use("/contact-us-form", ContactUsForm);
app.use("/scaffold-log", ScaffoldLogRouter);
app.use("/approval-form", ApprovalFormRoute);
app.use("/material-list", Material_listRoute);
app.use("/material", MaterialListWithProject);
app.use("/calendar-notes", calendarNotesRoute);
app.use("/custom-material-list", MaterialRoute);
app.use("/after-control-form", AfterControlForm);
app.use("/action-logs", ActionNotificationRoute);
app.use("/notification", CustomNotificationRoute);
app.use("/safe-job-analysis", safeJobAnalysisRoute);
app.use("/after-control-form", AfterControlFormRoute);
app.use("/after-control-visual-inspection", AfterControlVisualInspectionForm);

initializeDeactivationSchedules();
setInterval(deactivateExpiredAccounts, 60 * 60 * 1000);

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(3002, () => {
  console.log(`Server Started at ${3002}`);
});
