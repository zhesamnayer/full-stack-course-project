import HomeIcon from '@mui/icons-material/Home';
import EuroIcon from '@mui/icons-material/Euro';
import ShopIcon from '@mui/icons-material/Shop';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ScheduleIcon from '@mui/icons-material/Schedule';

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
        title: "Upcoming",
        icon: <ScheduleIcon />,
        link: "/upcoming"
    },
    // {
    //     title: "Categories",
    //     icon: <CategoryIcon />,
    //     link: "/categories"
    // },
    {
        title: "User Info",
        icon: <PersonIcon />,
        link: "/userinfo"
    },
    {
        title: "Users",
        icon: <GroupIcon />,
        link: "/users"
    },
    {
        title: "Logout",
        icon: <LogoutIcon />,
        link: "/logout"
    },
]