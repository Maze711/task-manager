import { Router } from "express"
import taskRoutes from "./task-routes"
import labelRoutes from "./label-routes"

const router = Router()

router.use("/tasks", taskRoutes)
router.use("/labels", labelRoutes)

export default router
