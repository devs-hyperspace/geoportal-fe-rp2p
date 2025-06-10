import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type SppIndikatorType = {
    id: number;
    indikator: string;
    kategori: string;
    id_kategori: string;
    sub_kategori: string;
    id_sub_kategori: string;
    unit: string;
    ambang_batas: number;
    admin_level_id: string;
    admin_level: string;
    attribute_penduduk: string;
    weight: number;
};

export type SppConfigStatusType = {
    settings_last_updated: string,
    calculation_last_updated: string,
    status: string
}


// Fetch all SppIndikators
export const useSppConfigStatus = () => {
    return useQuery<SppConfigStatusType>({
        queryKey: ["spp-config-status"],
        queryFn: async () => {
            const res = await fetch("/api/settings/spp-indikator/logs/calculation-status");
            if (!res.ok) throw new Error("Failed to fetch SPP Indikator Status");
            return res.json();
        },
    });
};

export const useSppIndikators = () => {
    return useQuery<SppIndikatorType[]>({
        queryKey: ["spp-indikator", "settings"],
        queryFn: async () => {
            const res = await fetch("/api/settings/spp-indikator");
            if (!res.ok) throw new Error("Failed to fetch indicators");
            return res.json();
        },
    });
};

// Fetch a single SppIndikator by ID
export const useSppIndikator = (id: number) => {
    return useQuery<SppIndikatorType>({
        queryKey: ["spp-indikator", "settings", id],
        queryFn: async () => {
            const res = await fetch(`/api/settings/spp-indikator/${id}`);
            if (!res.ok) throw new Error("Failed to fetch indicator");
            return res.json();
        },
        enabled: !!id, // Only fetch if ID is provided
    });
};

// Create a new SppIndikator
export const useCreateSppIndikator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Omit<SppIndikatorType, "id">) => {
            const res = await fetch("/api/settings/spp-indikator", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to create indicator");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
};


export const useSppCalculation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/py/spp", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Failed to trigger SPP index calculation");
            }

            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
}

// Update an existing SppIndikator
export const useUpdateSppIndikator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SppIndikatorType) => {
            const res = await fetch(`/api/settings/spp-indikator`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to update indicator");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
};

// Delete an SppIndikator
export const useDeleteSppIndikator = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/spp-indikator/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete indicator");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
};


// Fetch distinct kategori & id_kategori
export const useKategoriOptions = () => {
    return useQuery({
        queryKey: ["kategori-options"],
        queryFn: async () => {
            const res = await fetch("/api/settings/spp-indikator/kategori");
            if (!res.ok) throw new Error("Failed to fetch kategori");
            return res.json(); // Expect [{ kategori: "Health", id_kategori: "1" }, ...]
        },
    });
};

// Fetch distinct sub_kategori & id_sub_kategori
export const useSubKategoriOptions = () => {
    return useQuery({
        queryKey: ["sub-kategori-options"],
        queryFn: async () => {
            const res = await fetch("/api/settings/spp-indikator/sub-kategori");
            if (!res.ok) throw new Error("Failed to fetch sub_kategori");
            return res.json(); // Expect [{ sub_kategori: "Hospital", id_sub_kategori: "10" }, ...]
        },
    });
};

// Fetch distinct admin_level & admin_level_id
export const useAdminLevelOptions = () => {
    return useQuery({
        queryKey: ["admin-level-options"],
        queryFn: async () => {
            const res = await fetch("/api/settings/spp-indikator/admin-level");
            if (!res.ok) throw new Error("Failed to fetch admin_level");
            return res.json(); // Expect [{ admin_level: "Province", admin_level_id: "100" }, ...]
        },
    });
};


export type SppKlasifikasiType = {
    id: number;
    kelas: string;
    min: number;
    max: number;
    color: string;
};

export const useClassifications = () => {
    return useQuery<SppKlasifikasiType[]>({
        queryKey: ["spp-klasifikasi"],
        queryFn: async () => {
            const res = await fetch("/api/settings/spp-indikator/spp-klasifikasi");
            if (!res.ok) throw new Error("Failed to fetch classifications");
            return res.json();
        },
    });
};

export const useCreateClassification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<SppKlasifikasiType, "id">) => {
            const res = await fetch("/api/settings/spp-indikator/spp-klasifikasi", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to create classification");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-klasifikasi"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
};

export const useUpdateClassification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: SppKlasifikasiType) => {
            const res = await fetch(`/api/settings/spp-indikator/spp-klasifikasi`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to update classification");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-klasifikasi"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
};

export const useDeleteClassification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/settings/spp-indikator/spp-klasifikasi?id=${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete classification");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] });
            queryClient.invalidateQueries({ queryKey: ["spp-klasifikasi"] });
            queryClient.invalidateQueries({ queryKey: ["spp-indikator", "settings"] });
        }
    });
};


interface AddSettingsLogData {
    table_name: string;
    operation: string;
}

export const useCreateSettingsLog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (logData: AddSettingsLogData) => {
            const response = await fetch("/api/settings/spp-indikator/logs/calculation-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logData),
            });

            if (!response.ok) {
                throw new Error("Failed to add settings log");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spp-config-status"] }); // Invalidate settings logs query if needed
        },
    });
};