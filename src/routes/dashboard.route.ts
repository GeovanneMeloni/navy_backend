import { Router } from "express";
import { getDashboardSummaryReport } from "../controllers/dashboard.controller";
import { auth } from "../middlewares/auth";
import { checkPermission } from "../middlewares/checkPermission";

const dashboardRouter = Router();

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     summary: Obtém o resumo do dashboard (requer autenticação e permissão)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                   example: 4
 *                 activeUsers:
 *                   type: number
 *                   example: 4
 *                 inactiveUsers:
 *                   type: number
 *                   example: 0
 *                 usersByGender:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     feminino: 1
 *                     masculino: 2
 *                 totalCars:
 *                   type: number
 *                   example: 26
 *                 rentedCars:
 *                   type: number
 *                   example: 3
 *                 soldCars:
 *                   type: number
 *                   example: 7
 *                 revenuesByMonth:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     "2025-04": 86022
 *                     "2025-05": 117928
 *                 salesByModel:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     Mustang: 1
 *                     Corvette: 2
 *                 soldsByMonth:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                   example:
 *                     "2025-04": 1
 *                     "2025-05": 1
 */

dashboardRouter.get(
    "/summary",
    auth,
    checkPermission("view", "dashboard"),
    getDashboardSummaryReport
);

export { dashboardRouter };
