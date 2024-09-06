import { createBrowserRouter } from "react-router-dom"
import La from "@/pages/La"

const router = createBrowserRouter([
    {
        path: '/',
        element: <La />,
    },
])

export default router