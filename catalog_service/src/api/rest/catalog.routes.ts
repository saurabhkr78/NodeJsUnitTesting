import express, { Request, Response, NextFunction } from "express";

const router = express.Router();
//end points
router.post("/product", async (req: Request, res: Response, next: NextFunction) => {
    return res.status(201).json({ message: "Create Product" });
});

export default router; 