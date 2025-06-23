import { Request, Response, NextFunction } from "express";
import { getDashboardSummary } from "../services/dashboard.service";

async function getDashboardSummaryReport(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const summary = await getDashboardSummary();

        res.status(200).json(summary);
    } catch (error) {
        next(error);
    }
}

export { getDashboardSummaryReport };
