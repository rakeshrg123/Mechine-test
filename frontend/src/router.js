import {createBrowserRouter} from "react-router-dom"
import Login from "./components/Login";
import Register from "./components/Register";
import ListingProducts from "./components/ProductTable";
import AdminDashbord from "./components/AdminDashbord";
import VariantManagement from "./components/Variant";
import ProductForm from "./components/ProductForm";
import CartSummary from "./components/CartSummary";




const router = createBrowserRouter([
    {path: '',element:<Login/>},
    {path: '/login',element:<Login/>},
    {path: '/register',element:<Register/>},
    {path: '/admin-dashboard',element:<AdminDashbord/>},
    {path: '/list-product',element:<ListingProducts/>},
    {path: '/variant-managment/:id',element:<VariantManagement/>},
    {path: '/add-product',element:<ProductForm/>},
    {path: '/edit-product',element:<ProductForm/>},
    {path: '/cart',element:<CartSummary/>},

   
    
])

export default router;