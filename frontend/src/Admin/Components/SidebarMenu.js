import { LuLayoutDashboard } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { MdMapsHomeWork } from "react-icons/md";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { PiPersonSimpleRunBold } from "react-icons/pi";

export const sidebarData = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    href: "/admin-dashboard/home-page",
    submenu: null,
  },
  {
    label: "User",
    icon: FaRegUser,
    href: "#",
    submenu: [
      {
        label: "All Users",
        icon: FaRegUser,
        href: "/admin-dashboard/user/all-users",
      },
      {
        label: "Admin",
        icon: FaRegUser,
        href: "/admin-dashboard/user/all-admin",
      },
      {
        label: "Users",
        icon: FaRegUser,
        href: "/admin-dashboard/user/users",
      },
      {
        label: "Add New User",
        icon: FaRegUser,
        href: "/admin-dashboard/user/add-new-user",
      },
    ],
  },
  {
    label: "Projects",
    icon: MdMapsHomeWork,
    href: "#",
    submenu: [
      {
        label: "All Project",
        icon: MdMapsHomeWork,
        href: "/admin-dashboard/project/all-projects",
      },
      {
        label: "Add New Project",
        icon: MdMapsHomeWork,
        href: "#",
      },
      {
        label: "Invited Users",
        icon: MdMapsHomeWork,
        href: "/admin-dashboard/project/invited-user",
      },
      {
        label: "Invite Users",
        icon: MdMapsHomeWork,
        href: "/admin-dashboard/project/invite-user",
      },
    ],
  },
  {
    label: "Forms",
    icon: FaWpforms,
    href: "#",
    submenu: [
      {
        label: "All Forms",
        icon: FaWpforms,
        href: "/admin-dashboard/form/all-forms",
      },
      {
        label: "Approval Form",
        icon: FaWpforms,
        href: "/admin-dashboard/form/approval-forms",
      },
      {
        label: "SJA",
        icon: FaWpforms,
        href: "/admin-dashboard/form/SJA-forms",
      },
      {
        label: "After Control",
        icon: FaWpforms,
        href: "/admin-dashboard/form/after-control-forms",
      },
      {
        label: "Observation",
        icon: FaWpforms,
        href: "/admin-dashboard/form/observation-forms",
      },
      {
        label: "Material List",
        icon: FaWpforms,
        href: "/admin-dashboard/form/material-list-forms",
      },
    ],
  },
  {
    label: "Subscription",
    icon: MdOutlineSubscriptions,
    href: "/admin-dashboard/subscription-list-forms",
    submenu: [
      {
        label: "My Subscription",
        icon: MdOutlineSubscriptions,
        href: "#",
      },
      {
        label: "Subscription List",
        icon: MdOutlineSubscriptions,
        href: "/admin-dashboard/subscription-list-forms",
      },
      {
        label: "Add New Subscriber",
        icon: MdOutlineSubscriptions,
        href: "#",
      },
    ],
  },
  {
    label: "Payment",
    icon: MdOutlineAttachMoney,
    href: "#",
  },
  {
    label: "Report",
    icon: TbReport,
    href: "#",
  },
  {
    label: "Visitors",
    icon: PiPersonSimpleRunBold,
    href: "/admin-dashboard/visitor",
  },
];
