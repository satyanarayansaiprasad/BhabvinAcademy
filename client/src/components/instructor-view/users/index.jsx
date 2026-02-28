import { useEffect, useState } from "react";
import {
    registerSubAdminService,
    fetchAllSubAdminsService,
    updateSubAdminService,
    deleteSubAdminService,
} from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Trash, Lock, Unlock, Eye, EyeOff } from "lucide-react";

function InstructorUsers() {
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [subAdmins, setSubAdmins] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        userName: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [createdCredentials, setCreatedCredentials] = useState(null);

    const { toast } = useToast();

    async function fetchSubAdmins() {
        try {
            const response = await fetchAllSubAdminsService();
            if (response?.success) {
                setSubAdmins(response.data);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch sub-admins",
                variant: "destructive",
            });
        }
    }

    useEffect(() => {
        fetchSubAdmins();
    }, []);

    async function handleCreateUser(e) {
        e.preventDefault();
        if (!formData.userName || !formData.password) {
            toast({
                title: "Error",
                description: "Both username and password are required.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await registerSubAdminService(formData);
            if (response?.success) {
                toast({
                    title: "Success",
                    description: "Sub-Admin created successfully!",
                });
                setCreatedCredentials({ ...formData });
                setFormData({ userName: "", password: "" });
                fetchSubAdmins();
            } else {
                toast({
                    title: "Error",
                    description: response?.message || "Failed to create Sub-Admin",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "An error occurred while creating the user.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateUser() {
        if (!editData.userName) {
            toast({
                title: "Error",
                description: "Username is required.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const payload = { userName: editData.userName };
            if (editData.password) payload.password = editData.password;

            const response = await updateSubAdminService(editData.id, payload);
            if (response?.success) {
                toast({
                    title: "Success",
                    description: "User updated successfully!",
                });
                setIsEditing(false);
                fetchSubAdmins();
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update user",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(user) {
        const newStatus = user.status === "active" ? "blocked" : "active";
        try {
            const response = await updateSubAdminService(user._id, { status: newStatus });
            if (response?.success) {
                toast({
                    title: "Status Updated",
                    description: `User ${user.userName} is now ${newStatus}.`,
                });
                fetchSubAdmins();
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update user status",
                variant: "destructive",
            });
        }
    }

    async function handleDeleteUser(id) {
        if (window.confirm("Are you sure you want to delete this sub-admin? This action cannot be undone.")) {
            try {
                const response = await deleteSubAdminService(id);
                if (response?.success) {
                    toast({
                        title: "Deleted",
                        description: "Sub-Admin removed successfully",
                    });
                    fetchSubAdmins();
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Failed to delete user",
                    variant: "destructive",
                });
            }
        }
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-6 text-zinc-900">Sub-Admin Management</h2>

            <Tabs defaultValue="list" className="space-y-6">
                <TabsList className="bg-zinc-100 p-1 rounded-lg">
                    <TabsTrigger value="list" className="px-6 py-2 rounded-md transition-all">
                        Manage Users
                    </TabsTrigger>
                    <TabsTrigger value="create" className="px-6 py-2 rounded-md transition-all">
                        Create New
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <div className="border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-zinc-50">
                                <TableRow>
                                    <TableHead className="font-bold">Username</TableHead>
                                    <TableHead className="font-bold">Email (System)</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="text-right font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subAdmins.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                                            No sub-admins found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subAdmins.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell className="font-medium">{user.userName}</TableCell>
                                            <TableCell className="text-zinc-500 text-sm">{user.userEmail}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${user.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title={user.status === "active" ? "Block" : "Unblock"}
                                                        onClick={() => handleToggleStatus(user)}
                                                        className={user.status === "active" ? "hover:bg-amber-50" : "hover:bg-green-50"}
                                                    >
                                                        {user.status === "active" ? (
                                                            <Lock className="w-4 h-4 text-amber-600" />
                                                        ) : (
                                                            <Unlock className="w-4 h-4 text-green-600" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Edit"
                                                        onClick={() => {
                                                            setEditData({ id: user._id, userName: user.userName, password: "" });
                                                            setIsEditing(true);
                                                        }}
                                                    >
                                                        <Edit className="w-4 h-4 text-zinc-600" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Delete"
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="hover:bg-red-50 hover:border-red-200"
                                                    >
                                                        <Trash className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="create">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <p className="text-zinc-500 text-sm">
                                Create a new sub-admin with access to <b>Courses</b> and <b>Home Config</b> only.
                            </p>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="userName">Username</Label>
                                    <Input
                                        id="userName"
                                        placeholder="Enter unique username"
                                        value={formData.userName}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter strong password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="h-12 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all"
                                >
                                    {loading ? "Creating..." : "Create Sub-Admin"}
                                </Button>
                            </form>
                        </div>

                        {createdCredentials && (
                            <div className="bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    Account Created Successfully
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Username</Label>
                                        <p className="text-xl font-mono mt-1">{createdCredentials.userName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Password</Label>
                                        <p className="text-xl font-mono mt-1">{createdCredentials.password}</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-zinc-400 text-xs leading-relaxed">
                                            Please copy these credentials now. For security reasons, the password will not be shown again.
                                        </p>
                                        <Button
                                            variant="link"
                                            className="text-white p-0 h-auto mt-4 text-xs hover:text-green-400"
                                            onClick={() => setCreatedCredentials(null)}
                                        >
                                            Close Summary
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Edit Modal */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Sub-Admin</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-username">Username</Label>
                            <Input
                                id="edit-username"
                                value={editData.userName}
                                onChange={(e) => setEditData({ ...editData, userName: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                placeholder="Enter new password"
                                value={editData.password}
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} disabled={loading}>
                            {loading ? "Updating..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default InstructorUsers;
