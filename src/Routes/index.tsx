
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Records from '../Records/index';
import Menu from '../Home';
import AddRecord from '../Records/AddRecord/index';
import ViewRecords from '../Records/ViewRecords/index';
import App from '../App';
import Login from '../Login';
import Expenses from '../Expenses/index';
import AddExpence from '../Expenses/AddExpense/index';

const Routes = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "/",
                    element: <Menu />,
                },
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/records",
                    element: <Records />,
                },
                {
                    path: "/addrecord",
                    element: <AddRecord />,
                },
                {
                    path: "/view/:id",
                    element: <ViewRecords />,
                },
                {
                    path: "/expenses",
                    element: <Expenses />,
                },
                {
                    path: "/add-expence",
                    element: <AddExpence />,
                },
            ]
        }

    ]);

    return <RouterProvider router={router} />
}

export default Routes