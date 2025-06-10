import { useState, useEffect } from "react";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { genSaltSync, hashSync } from "bcrypt-ts";

const LoadingComponent = () => (
    <div className="absolute top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-40 rounded">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" />
    </div>
);

export const UserForm = ({ closeModal, user, guid}: { closeModal: () => void; user?: any;guid:string}) => {
    const isEditing = Boolean(user);

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        password: "",
        roleId: "",
        groupId: "",
        kabkotId: "",
        geonodeUid: "",
        geonodeAccessToken: "",
    });

    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [kabkots, setKabkots] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [isLoadingUserData, setIsLoadingUserData] = useState(isEditing); // Only load user data if editing

    // Fetch dropdown options with 1-second delay before removing the loader
    useEffect(() => {
        async function fetchOptions() {
            try {
                const [rolesRes, groupsRes, kabkotsRes] = await Promise.all([
                    fetch("/api/user/roles"),
                    fetch("/api/user/groups"),
                    fetch("/api/user/kabkots"),
                ]);

                if (!rolesRes.ok || !groupsRes.ok || !kabkotsRes.ok) throw new Error("Failed to fetch data");

                const [rolesData, groupsData, kabkotsData] = await Promise.all([
                    rolesRes.json(),
                    groupsRes.json(),
                    kabkotsRes.json(),
                ]);

                setRoles(rolesData);
                setGroups(groupsData);
                setKabkots(kabkotsData);

                // Delay hiding the loader by 1 second
                setTimeout(() => {
                    setIsLoadingOptions(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
                setIsLoadingOptions(false);
            }
        }

        fetchOptions();
    }, []);

    // Populate form when editing (only after options are loaded)
    useEffect(() => {
        if (user && !isLoadingOptions) {
            setFormData({
                username: user.username || "",
                name: user.name || "",
                password: "",
                roleId: user.roleId?.toString() || "",
                groupId: user.groupId?.toString() || "",
                kabkotId: user.kabkotId?.toString() || "",
                geonodeUid: user.geonodeUid?.toString() || "",
                geonodeAccessToken: user.geonodeAccessToken?.toString() || "",
            });

            // Add a slight delay before setting user data as loaded
            setTimeout(() => {
                setIsLoadingUserData(false);
            }, 100);
        }
    }, [user, isLoadingOptions]);

    const createUser = useCreateUser(guid);
    const updateUser = useUpdateUser(guid);
    
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | string,
        field?: string
    ) => {
        if (typeof event === "string" && field) {
            // Handle dropdown changes (Select component)
            setFormData((prev) => ({ ...prev, [field]: event }));
        } else if (event && typeof event === "object" && "target" in event) {
            // Ensure event is a ChangeEvent<HTMLInputElement>
            const inputEvent = event as React.ChangeEvent<HTMLInputElement>;
            const { name, value } = inputEvent.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };
    

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { ...formData };

        if (!isEditing && userData.password) {
            const salt = genSaltSync(10); // Generate salt with cost factor of 10
            userData.password = hashSync(userData.password, salt); // Hash password
        }

        if (isEditing) {
            await updateUser.mutateAsync({ ...user, ...userData });
        } else {
            await createUser.mutateAsync({ ...user, ...userData });
        }
        closeModal();
    };

    return (
        <div className="max-h-[80vh] overflow-y-auto p-6">
            {/* Show LoadingComponent while fetching data */}
            <div className="relative flex flex-col rounded shadow border">
                {(isLoadingUserData) && <LoadingComponent />}
                <div className="p-6 pb-0 text-2xl font-semibold text-gray-700">
                    {isEditing ? "Edit User" : "Create User"}
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Username</Label>
                        <Input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Full Name</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
                    </div>
                    {!isEditing && (
                        <div className="flex flex-col gap-2">
                            <Label className="text-gray-600 font-medium">Password</Label>
                            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Role</Label>
                        <Select onValueChange={(value) => handleChange(value, "roleId")} value={formData.roleId}>
                            <SelectTrigger className="text-gray-600">
                                <SelectValue placeholder="Pilih Role">
                                    {roles.find(r => r.id.toString() === formData.roleId)?.name || "Pilih Role"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {user?.roleId !== 1 && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-600 font-medium">Group</Label>
                                <Select onValueChange={(value) => handleChange(value, "groupId")} value={formData.groupId}>
                                    <SelectTrigger className="text-gray-600">
                                        <SelectValue placeholder="Pilih group" className="text-gray-600">
                                            {groups.find(g => g.id === formData.groupId)?.name || "Select Group"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"Pilih Group"} disabled>
                                            Pilih Group
                                        </SelectItem>
                                        {groups.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label className="text-gray-600 font-medium">Kota/Kabupaten</Label>
                                <Select onValueChange={(value) => handleChange(value, "kabkotId")} value={formData.kabkotId}>
                                    <SelectTrigger className="text-gray-600">
                                        <SelectValue placeholder="Pilih Kota/Kabupaten">
                                            {formData.kabkotId
                                                ? kabkots.find(k => k.id === formData.kabkotId)?.name
                                                : "Pilih Kota/Kabupaten"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"Pilih Kota/Kabupaten"} disabled>
                                            Pilih Kota/Kabupaten
                                        </SelectItem>
                                        {kabkots.map((kabkot) => (
                                            <SelectItem key={kabkot.id} value={kabkot.id}>
                                                {kabkot.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </>

                    )}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Geonode UID</Label>
                        <Input name="geonodeUid" type="number" value={formData.geonodeUid} onChange={handleChange} placeholder="Geonode UID" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-600 font-medium">Geonode Access Token</Label>
                        <Input name="geonodeAccessToken" value={formData.geonodeAccessToken} onChange={handleChange} placeholder="Geonode Access Token" required />
                    </div>
                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                            {isEditing ? "Update" : "Create"} User
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
