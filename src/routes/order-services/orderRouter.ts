import express from "express";
import { verifyToken } from "../../middleware/auth";
import { createNewOrder } from "../../controllers/order-services/orderController";

const router = express.Router();

router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const result = await createNewOrder(req);
    res.send(result);
    res.end();
  } catch (err: any) {
    res.status(400);
    res.end(err.message);
  }
});

export { router as orderRouter };
