import express from "express";
import { createOrder, createCODOrder, verifyPayment, updateOrderStatus } from "../controllers/orderController.js";
import { runOrderCleanup } from "../utils/maintenance.js";
import { adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", createOrder); // Online Payment
router.post("/create-cod", createCODOrder); // Cash on Delivery
router.post("/verify", verifyPayment); // Verification

// Protected Admin Routes
router.post("/update-status", adminAuth, updateOrderStatus);
router.post("/cleanup", adminAuth, async (req, res) => {
    try {
        await runOrderCleanup();
        res.json({ message: "Cleanup triggered successfully. Check admin email." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
