import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UserState {
    activeUsername: string;
    activeGeonodeUid: string;
    activeKabkotId: string;
    activeGeonodeAccessToken: string;
    activeRoleId: number | null;
}

interface UsersStore {
    user: UserState;
    setUser: (updates: Partial<UserState>) => void;
}

export const useUsersControl = create<UsersStore>()(
    devtools(
        (set) => ({
            user: {
                activeUsername:'',
                activeGeonodeUid: '',
                activeKabkotId: '',
                activeGeonodeAccessToken: '',
                activeRoleId: null,
            },
            setUser: (updates: Partial<UserState>) =>
                set((state) => ({
                    user: { ...state.user, ...updates },
                })),
        }),
        { store: 'USERS-CONTROL', name: 'store' }
    )
);





export const useUserMember = (guid:string) => {
    return useQuery({
        queryKey: ["useGetUserMember", guid],
        queryFn: async () => {
            const url = `/api/user/${guid}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        },
        staleTime: 300000,
        // enabled: !!guid
    });
};