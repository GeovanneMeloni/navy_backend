export type Action = "create" | "edit" | "delete" | "view";
export type Resource = "car" | "user" | "dashboard";
export type Role = "admin" | "employee" | "client";

export const permissions: Record<Role, Record<Resource, Action[]>> = {
    admin: {
        car: ["create", "edit", "delete", "view"],
        user: ["create", "edit", "delete", "view"],
        dashboard: ["view"],
    },
    employee: {
        car: ["create", "edit", "delete", "view"],
        user: ["view"],
        dashboard: [],
    },
    client: {
        car: ["create", "edit", "delete", "view"],
        user: [],
        dashboard: [],
    },
};
