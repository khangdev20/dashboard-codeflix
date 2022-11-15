import DashboardPage from "../pages/DashboardPage"
import FilmsPage from "../pages/FilmsPage"
import GenresPage from "../pages/GenresPage"
import PersonsPage from "../pages/PersonsPage"
import ProducersPage from "../pages/ProducersPage"
import ProfilePage from "../pages/ProfilePage"
import UsersPage from "../pages/UsersPage"
import ViewsPage from "../pages/ViewsPage"
import SalesPage from "../pages/SalesPage"
import LoginPage from "../pages/auth/Login/Login"
import PackagePage from "../pages/PackagePage"

export const publicRoutes = [
  {path: '/dashboard', component: DashboardPage},
  {path: '/films', component: FilmsPage},
  {path: '/genres', component: GenresPage},
  {path: '/persons', component: PersonsPage},
  {path: '/producers', component: ProducersPage},
  {path: '/profile', component: ProfilePage},
  {path: '/users', component: UsersPage},
  {path: '/views', component: ViewsPage},
  {path: '/sales', component: SalesPage},
  {path: '/packages', component: PackagePage},
  {path: '/login', component: LoginPage, layout: null},
]


