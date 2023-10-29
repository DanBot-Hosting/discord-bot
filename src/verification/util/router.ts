import { Router, Request, Response } from "express";

const router = Router();
import routes from "./routes";

router.get("/verify/:id", async (req: Request, res: Response) => {
    routes.verify.get(req, res);
})

router.post("/verify/:id", async (req: Request, res: Response) => {
    routes.verify.post(req, res);
})

export default router;
