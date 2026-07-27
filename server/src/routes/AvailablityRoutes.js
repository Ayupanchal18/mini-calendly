import { Router } from "express";
import {
    AvailablitySlotsController,
    BookSlotsController,
    GetSlotsController,
    GenerateLinkController
} from "../controllers/AvailablitySlotsController.js";

const router = Router();

router.post("/create-slots", AvailablitySlotsController);
router.post("/book-slots", BookSlotsController);
router.get("/get-slots/:token", GetSlotsController);
router.post("/get-slots", GetSlotsController);
router.post("/generate-link", GenerateLinkController);

export default router;