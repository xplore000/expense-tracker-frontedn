import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout/index';
//import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));


// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const ShowIncome=Loadable(lazy(()=>import('pages/components-overview/ShowIncome')))
//const LandingPage = Loadable(lazy(()=>import('pages/extra-pages/LandingPage')))
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    
    
  
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'income',
      element: <ShowIncome/>
    }
  ]
};

export default MainRoutes;
