"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type User = {
    id: number;
    username: string;
    name: string;
    password: string;
    roleId: number;
    groupId?: string | null;
    kabkotId?: string | null;
    geonodeUid: number;
    geonodeAccessToken: string;
    role?: { id: number; name: string };
    group?: { id: string; name: string };
    kabkot?: { id: string; name: string };
};

// Fetch all users
export const useUsers = (guid:string) => {
    return useQuery<User[]>({
        queryKey: ["user", guid],
        queryFn: async () => {
            const url = `/api/user/${guid}`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await res.json();
            return data;
        },
    });
};


export const useCreateUser = (guid:string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: Omit<User, "id">) => {
            // Step 1: Fetch the last user ID from the database
            const lastUserRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/last-id`);
            if (!lastUserRes.ok) throw new Error("Failed to fetch last user ID");

            const lastUser = await lastUserRes.json();
            const newUserId = lastUser?.id ? lastUser.id + 1 : 1; // Increment last ID or start from 1

            const payload = {
                id: newUserId, // Set new user ID
                ...data,
                kabkotId: data.kabkotId ? data.kabkotId : "",
                groupId: data.groupId ? data.groupId : "",
                roleId: data.roleId ? Number(data.roleId) : null,
                geonodeUid: data.geonodeUid ? Number(data.geonodeUid) : null,
            };

            // Step 3: Send the payload to create the new user
            const res = await fetch(`/api/user/${guid}`, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to create user");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    });
};

// Update a user
export const useUpdateUser = (guid:string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: User) => {
            // Ensure kabkotId is null if empty
            const payload = {
                ...data,
                kabkotId: data.kabkotId ? data.kabkotId : "",
                groupId: data.groupId ? data.groupId : "",
                roleId: data.roleId ? Number(data.roleId) : null,
                geonodeUid: data.geonodeUid ? Number(data.geonodeUid) : null,
            };

            const res = await fetch(`/api/user/${guid}`, {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to update user");
            return res.json();
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    });
};

// Delete a user
export const useDeleteUser = (guid:string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await fetch(`/api/user/${guid}`, {
                method: "DELETE",
                body: JSON.stringify({ id }),
                headers: { "Content-Type": "application/json" },
            });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    });
};

export const useUserBbox = (kode_kabkot: string) => {
    return useQuery({
        queryKey: ["bbox", kode_kabkot], 
        queryFn: async () => {
            const url = `/api/user/bbox/${kode_kabkot}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Failed to fetch bbox: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            return data;
        },
        staleTime: 0, // Ensures fresh data
        refetchOnMount: true, // Ensures data is always fetched when component mounts
        refetchOnWindowFocus: false, // Prevents refetching when window gains focus
        refetchOnReconnect: true, // Refetch when network reconnects
        enabled: !!kode_kabkot, // Only fetch if kode_kabkot is available
    });
};
