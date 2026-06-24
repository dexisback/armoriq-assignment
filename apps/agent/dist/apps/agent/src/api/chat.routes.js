import { Router } from "express";
import { toolLoopService } from "../services/agent-services/tool-loop.service.js";
export const chatRouter = Router();
chatRouter.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const response = await toolLoopService.run(message);
        return res.json({
            success: true,
            response,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({
            success: false,
            error: error instanceof Error
                ? error.message
                : "Unknown error",
        });
    }
});
