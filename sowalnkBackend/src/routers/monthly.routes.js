import { Router } from "express";
import { monthlyTaskController } from "../controllers/monthly.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes
router.use(verifyJWT);

router.post("/monthly", monthlyTaskController.createTask);
router.get("/monthly", monthlyTaskController.getAllTasks);
router.patch("/monthly/:id/toggle", monthlyTaskController.toggleTaskCompletion);
router.delete("/monthly/:id/delete", monthlyTaskController.deleteTask);
router.post(
  "/monthly/:id/upload",
  upload.single("file"),
  monthlyTaskController.uploadFileController
);

export default router;
