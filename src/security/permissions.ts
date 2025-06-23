export type Action = "create" | "edit" | "delete" | "view";
export type Resource = "car" | "user";
export type Role = "admin" | "employee" | "client";

export const permissions: Record<Role, Record<Resource, Action[]>> = {
    admin: {
        car: ["create", "edit", "delete", "view"],
        user: ["create", "edit", "delete", "view"],
    },
    employee: {
        car: ["create", "edit", "delete", "view"],
        user: ["view"],
    },
    client: {
        car: ["create", "edit", "delete", "view"],
        user: [],
    },
};
