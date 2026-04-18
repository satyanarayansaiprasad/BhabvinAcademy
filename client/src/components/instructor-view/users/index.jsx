import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Edit, 
    Trash, 
    Lock, 
    Unlock, 
    Eye, 
    EyeOff, 
    UserPlus, 
    Shield, 
    MoreVertical, 
    BadgeCheck, 
    Key,
    RefreshCw,
    X
} from "lucide-react";
import { 
    registerSubAdminService, 
    fetchAllSubAdminsService, 
    updateSubAdminService, 
    deleteSubAdminService 
} from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
    const [activeTab, setActiveTab] = useState("list");
    const { auth } = useContext(AuthContext);
    const { toast } = useToast();

    async function fetchSubAdmins() {
        try {
            const response = await fetchAllSubAdminsService(auth?.user?._id);
            if (response?.success) setSubAdmins(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => { fetchSubAdmins(); }, []);

    async function handleCreateUser(e) {
        e.preventDefault();
        if (!formData.userName || !formData.password) {
            toast({ title: "Error", description: "Username and password are required.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const response = await registerSubAdminService(formData);
            if (response?.success) {
                setCreatedCredentials({ ...formData });
                setFormData({ userName: "", password: "" });
                fetchSubAdmins();
                toast({ title: "Success", description: "Internal node successfully registered." });
            } else {
                toast({ title: "Registration Failed", description: response?.message || "Failed to create user.", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateUser() {
        if (!editData.userName) return;
        setLoading(true);
        try {
            const payload = { userName: editData.userName };
            if (editData.password) payload.password = editData.password;

            const response = await updateSubAdminService(editData.id, payload);
            if (response?.success) {
                toast({ title: "Node Updated", description: "Access parameters successfully modified." });
                setIsEditing(false);
                fetchSubAdmins();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(user) {
        const newStatus = user.status === "active" ? "blocked" : "active";
        try {
            const response = await updateSubAdminService(user._id, { status: newStatus });
            if (response?.success) {
                toast({ title: "Status Synchronized", description: `Node ${user.userName} is now ${newStatus}.` });
                fetchSubAdmins();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleDeleteUser(id) {
        if (window.confirm("FATAL: Permantely remove this administrative node?")) {
            try {
                const response = await deleteSubAdminService(id);
                if (response?.success) {
                    toast({ title: "Node Terminated", description: "All associated permissions revoked." });
                    fetchSubAdmins();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="space-y-6 pb-20">
            
            {/* MODULE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-[32px] font-black tracking-tighter text-[#f5f5f7] mb-1">users.</h2>
                    <p className="text-[#86868b] text-[13px] font-medium tracking-tight">Internal node management and permission synchronization.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Multi-purpose button depending on context if needed */}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-[#111118] border border-white/[0.06] p-1.5 rounded-2xl h-auto">
                    <TabsTrigger value="list" className="px-8 py-2.5 rounded-xl text-[13px] font-bold text-[#86868b] data-[state=active]:bg-white/[0.05] data-[state=active]:text-[#f5f5f7] transition-all">
                        Active Nodes
                    </TabsTrigger>
                    <TabsTrigger value="create" className="px-8 py-2.5 rounded-xl text-[13px] font-bold text-[#86868b] data-[state=active]:bg-[#0071e3] data-[state=active]:text-white transition-all">
                        <UserPlus size={16} className="mr-2" /> Register New Node
                    </TabsTrigger>
                </TabsList>

                {/* USER LISTING */}
                <TabsContent value="list">
                    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white/[0.01] border-b border-white/[0.04]">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Administrative Node</TableHead>
                                        <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">System ID</TableHead>
                                        <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px]">Authorization</TableHead>
                                        <TableHead className="py-5 px-8 font-bold text-[#3a3a3a] uppercase tracking-widest text-[9px] text-right">Access Controls</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence>
                                        {subAdmins.length === 0 ? (
                                            <TableRow className="hover:bg-transparent">
                                                <TableCell colSpan={4} className="py-24 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-white/[0.03] rounded-3xl flex items-center justify-center text-3xl mb-6">🛸</div>
                                                        <p className="text-[#444] font-black uppercase tracking-widest text-[10px]">No auxiliary nodes registered.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            subAdmins.map((user) => (
                                                <motion.tr 
                                                    key={user._id} 
                                                    initial={{ opacity: 0 }} 
                                                    animate={{ opacity: 1 }} 
                                                    className="border-b border-white/[0.04] group hover:bg-white/[0.02] transition-colors"
                                                >
                                                    <TableCell className="py-6 px-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[12px] font-black text-[#555] uppercase shrink-0 border border-white/[0.05]">
                                                                {user.userName.substring(0, 2)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#f5f5f7] text-[15px] leading-none mb-1 group-hover:text-[#0071e3] transition-colors">{user.userName}</p>
                                                                <p className="text-[10px] font-bold text-[#3a3a3a] uppercase tracking-wider">Sub-Admin Access</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6 px-8">
                                                        <code className="text-[11px] text-[#444] font-mono">{user._id.substring(0, 8)}...</code>
                                                    </TableCell>
                                                    <TableCell className="py-6 px-8">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.status === "active" ? 'bg-[#30d158]/10 text-[#30d158]' : 'bg-[#ff453a]/10 text-[#ff453a]'}`}>
                                                            {user.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-6 px-8 text-right">
                                                        <div className="flex justify-end gap-2 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                onClick={() => handleToggleStatus(user)}
                                                                className={`h-9 w-9 rounded-xl transition-all flex items-center justify-center p-0 ${user.status === "active" ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                                                                title={user.status === "active" ? "Suspend Access" : "Activate Access"}
                                                            >
                                                                {user.status === "active" ? <Lock size={14} /> : <Unlock size={14} />}
                                                            </Button>
                                                            <Button
                                                                onClick={() => { setEditData({ id: user._id, userName: user.userName, password: "" }); setIsEditing(true); }}
                                                                className="h-9 w-9 bg-white/[0.05] hover:bg-white/[0.1] text-[#86868b] rounded-xl transition-all flex items-center justify-center p-0 border border-white/[0.06]"
                                                            >
                                                                <Edit size={14} />
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="h-9 w-9 bg-[#ff453a]/10 text-[#ff453a] hover:bg-[#ff453a]/20 rounded-xl transition-all flex items-center justify-center p-0"
                                                            >
                                                                <Trash size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabsContent>

                {/* CREATE NEW NODE */}
                <TabsContent value="create">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#111118] border border-white/[0.06] rounded-3xl p-10 space-y-8"
                        >
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight text-[#f5f5f7]">Initialize Node.</h3>
                                <p className="text-[#86868b] text-[13px] leading-relaxed">System-level registration for auxiliary administrative accounts. These nodes will have restricted permissions focused on inventory and configuration management.</p>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-1">Unique Identifier</Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"><Shield size={16} /></div>
                                        <Input
                                            placeholder="Enter username for registration..."
                                            value={formData.userName}
                                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                            className="h-14 pl-12 bg-white/[0.02] border-white/[0.08] rounded-2xl text-[14px] text-[#f5f5f7] outline-none focus:border-[#0071e3]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#444] ml-1">Access Credentials</Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444]"><Key size={16} /></div>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Assign a secure password..."
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="h-14 pl-12 pr-12 bg-white/[0.02] border-white/[0.08] rounded-2xl text-[14px] text-[#f5f5f7] outline-none focus:border-[#0071e3]/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#86868b] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#0071e3]/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <><UserPlus size={18} strokeWidth={3} /> Register Node</>}
                                </Button>
                            </form>
                        </motion.div>

                        <div className="relative">
                            <AnimatePresence>
                                {createdCredentials ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }} 
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-gradient-to-br from-[#0071e3] to-[#00d4ff] h-full rounded-3xl p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-[#0071e3]/30"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2" />
                                        
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
                                            <BadgeCheck size={32} strokeWidth={3} />
                                        </div>

                                        <h3 className="text-3xl font-black mb-4 tracking-tight leading-none">Initialization Successful.</h3>
                                        <p className="text-white/80 text-[14px] leading-relaxed mb-10">Secondary node successfully integrated into the system. Please archive these credentials securely.</p>

                                        <div className="space-y-6">
                                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Administrative Node</p>
                                                <p className="text-xl font-mono font-bold tracking-tight uppercase">{createdCredentials.userName}</p>
                                            </div>
                                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Authorization Secret</p>
                                                <p className="text-xl font-mono font-bold tracking-tight">{createdCredentials.password}</p>
                                            </div>
                                        </div>

                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setCreatedCredentials(null)}
                                            className="mt-12 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10"
                                        >
                                            Return to Form
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <div className="bg-[#111118]/40 border border-white/[0.04] h-full rounded-3xl border-dashed flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center mb-6">
                                            <Shield size={32} className="text-[#3a3a3a]" />
                                        </div>
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#333] mb-4">Awaiting Node Registration</h4>
                                        <p className="text-[12px] text-[#444] leading-relaxed">Secure credentials and node identity will be generated upon successful form submission.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* EDIT NODE DIALOG (Custom Modal implementation for dark-mode depth) */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#0a0a0f]/80 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1c1c1e] border border-white/[0.1] rounded-[32px] p-10 max-w-sm w-full shadow-2xl relative overflow-hidden">
                             <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-[#444] hover:text-[#f5f5f7] transition-colors"><X size={20} /></button>
                             <h2 className="text-[24px] font-black tracking-tight text-[#f5f5f7] mb-8 leading-tight">Modify Node Access.</h2>
                             
                             <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Identity Identifier</Label>
                                    <Input
                                        value={editData.userName}
                                        onChange={(e) => setEditData({ ...editData, userName: e.target.value })}
                                        className="h-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-[#444] ml-1">Updated Credentials</Label>
                                    <Input
                                        placeholder="Identity secret (Null to preserve)"
                                        type="password"
                                        value={editData.password}
                                        onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                        className="h-12 bg-white/[0.03] border-white/[0.08] rounded-xl text-[13px] text-[#f5f5f7] outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 pt-4">
                                    <Button
                                        onClick={handleUpdateUser}
                                        disabled={loading}
                                        className="w-full h-14 bg-[#f5f5f7] hover:bg-white text-[#0a0a0f] text-[14px] font-black rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-95"
                                    >
                                        {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "Save Modifications"}
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        className="w-full h-12 bg-transparent text-[#444] hover:text-[#86868b] text-[13px] font-bold transition-all"
                                    >
                                        Disregard Changes
                                    </Button>
                                </div>
                             </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default InstructorUsers;
