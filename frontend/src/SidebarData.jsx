import HomeIcon from '@mui/icons-material/Home';
import EuroIcon from '@mui/icons-material/Euro';
import ShopIcon from '@mui/icons-material/Shop';
import LogoutIcon from '@mui/icons-material/Logout';

import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

export const SidebarData = [
    {
        title: "home",
        icon: <HomeIcon />,
        link: "/"
    },
    {
        title: "Incomes",
        icon: <EuroIcon />,
        link: "/incomes"
    },
    {
        title: "Expenses",
        icon: <ShopIcon />,
        link: "/expenses"
    },
    {
        title: "Report",
        icon: <SettingsApplicationsIcon />,
        link: "/report"
    },
    {
        title: "Export",
        icon: <SettingsApplicationsIcon />,
        link: "/export"
    },
    {
        title: "Settings",
        icon: <SettingsApplicationsIcon />,
        link: "/settings"
    },
    {
        title: "Logout",
        icon: <LogoutIcon />,
        link: "/logout"
    },
]