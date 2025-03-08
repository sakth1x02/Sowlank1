import { Router } from "express";
import { yearlyTaskController } from "../controllers/yearly.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all routes
router.use(verifyJWT);

router.post("/yearly", yearlyTaskController.createTask);
router.get("/yearly", yearlyTaskController.getAllTasks);
router.patch("/yearly/:id/toggle", yearlyTaskController.toggleTaskCompletion);
router.delete("/yearly/:id/delete", yearlyTaskController.deleteTask);
router.post(
  "/yearly/:id/upload",
  upload.single("file"),
  yearlyTaskController.uploadFileController
);

export default router;
