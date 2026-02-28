import { useState } from "react";
import { registerSubAdminService } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

function InstructorUsers() {
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

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
                    description: response?.message || "Sub-Admin created successfully!",
                });
                setFormData({ userName: "", password: "" });
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

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200">
            <h2 className="text-xl font-bold mb-6 text-zinc-900">Create Sub-Admin User</h2>
            <p className="text-zinc-500 mb-6 text-sm">
                Sub-Admins have restricted access. They can only view and manage <b>Courses</b> and the <b>Home Config</b>.
            </p>

            <form onSubmit={handleCreateUser} className="max-w-md space-y-4">
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
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-bold"
                >
                    {loading ? "Creating..." : "Create Sub-Admin"}
                </Button>
            </form>
        </div>
    );
}

export default InstructorUsers;
