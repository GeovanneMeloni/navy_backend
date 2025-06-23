import { Car } from "../models/car/car.model";
import { User } from "../models/user/user.model";

interface DashboardAdminSummary {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByGender: {
        feminino?: number;
        masculino?: number;
        [key: string]: number | undefined;
    };
    totalCars: number;
    rentedCars: number;
    soldCars: number;
    revenuesByMonth: {
        [month: string]: number; // Ex: "2025-04": 86022
    };
    salesByModel: {
        [model: string]: number; // Ex: "Mustang": 1
    };
    soldsByMonth: {
        [month: string]: number; // Ex: "2025-01": 1
    };
}

async function getDashboardSummary(): Promise<DashboardAdminSummary> {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ active: true });
    const inactiveUsers = await User.countDocuments({ active: false });

    // ignorar se estiver vazio
    const usersByGender = await User.aggregate([
        {
            $group: {
                _id: "$user_profile.gender",
                count: { $sum: 1 },
            },
        },
    ]);

    const filteredUsersByGender = usersByGender.filter(
        (item) => item._id != null && item._id !== undefined
    ); // Ignorar valores nulos

    const totalCars = await Car.countDocuments();
    const rentedCars = await Car.countDocuments({ status: "rented" });
    const soldCars = await Car.countDocuments({ status: "sold" });

    const salesByModel = await Car.aggregate([
        { $match: { status: "sold" } },
        {
            $group: {
                _id: "$model",
                count: { $sum: 1 },
            },
        },
    ]);

    const soldsByMonth = await Car.aggregate([
        { $match: { status: "sold" } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$sold_at" } }, // Agrupa por ano e mês
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 }, // Ordena por mês
        },
    ]);

    const revenuesByMonth = await Car.aggregate([
        { $match: { status: "sold" } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$sold_at" } }, // Agrupa por ano e mês
                totalRevenue: { $sum: "$price" }, // Soma os preços dos carros vendidos
            },
        },
        {
            $sort: { _id: 1 }, // Ordena por mês
        },
    ]);

    const dashboardSummary = {
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersByGender: Object.fromEntries(
            filteredUsersByGender.map((item) => [item._id, item.count])
        ),

        totalCars,
        rentedCars,
        soldCars,
        revenuesByMonth: Object.fromEntries(
            revenuesByMonth.map((item) => [item._id, item.totalRevenue])
        ),
        salesByModel: Object.fromEntries(
            salesByModel.map((item) => [item._id, item.count])
        ),
        soldsByMonth: Object.fromEntries(
            soldsByMonth.map((item) => [item._id, item.count])
        ),
    };

    return dashboardSummary;
}

export { getDashboardSummary, DashboardAdminSummary };
