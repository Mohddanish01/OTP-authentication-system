import {lazy, Suspence} from "raect";
import { Toaster} from "react-hot-toast"
import {createBrowserRouter, RouterProvider} from "react-router-dom" 

const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const Verify = lazy(() => import("./pages/Verify"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

const router = createBrowserRouter([
  {
    path : "/",
    element : (<ProtectedRoute><Home/></ProtectedRoute>),

  },
  {
    path : "/signup",
    element : <Signup />
  },
  {
    path : "/login",
    element : <Login />
  },
  {
    path : "/verify/:toekn",
    element : <Verify />
  },
  {
    path : "/verify",
    element : <VerifyEmail />
  },
  {
    path : "/forgot-password",
    element : <ForgotPassword />
  },
  {
    path : "/verify-otp/:email",
    element : <VerifyOTP />
  },
  {
    path : "/change-password/:email",
    element : <ChangePassword />
  }
]
)

const App = () => {
  return (
    <Suspence fallback = {<h1>Loadingggg...</h1>}>
      <Toaster/>
      <RouterProvider router={router}/>
    </Suspence>
  )
}

export default App
