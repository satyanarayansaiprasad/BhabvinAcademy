import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
import { AuthContext } from "@/context/auth-context";
import { deleteCartItemService } from "@/services";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function CartPage() {
    const { cartItems, setCartItems, fetchCartItems } = useContext(StudentContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (auth?.user?._id) fetchCartItems(auth?.user?._id);
    }, [auth?.user?._id]);

    async function handleDeleteCartItem(courseId) {
        const response = await deleteCartItemService(auth?.user?._id, courseId);
        if (response?.success) {
            setCartItems(response?.data);
            toast({ title: "Removed from Cart", description: "The course has been removed successfully." });
        }
    }

    const calculateTotal = () => cartItems.reduce((acc, obj) => acc + parseFloat(obj.pricing || 0), 0);

    return (
        <div className="bg-slate-50 min-h-screen pt-20 xs:pt-24 md:pt-32 pb-16 xs:pb-20">
            <div className="container mx-auto px-4 xs:px-5 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 xs:mb-10 md:mb-12">
                    <h1 className="text-3xl xs:text-4xl md:text-[50px] font-black tracking-tighter text-zinc-900 mb-1 xs:mb-2">Your Cart.</h1>
                    <p className="text-zinc-500 font-medium text-sm xs:text-base tracking-tight">
                        {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in your selection. Finish your order to start learning.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 md:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4 xs:space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.courseId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-[24px] xs:rounded-[32px] border border-zinc-200/60 p-4 xs:p-6 flex flex-col xs:flex-row gap-4 xs:gap-6 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="w-full xs:w-40 md:w-48 h-32 xs:h-28 rounded-xl xs:rounded-2xl overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-base xs:text-xl font-bold text-zinc-900 mb-1 leading-tight">{item.title}</h3>
                                                <p className="text-xs xs:text-sm text-zinc-500 font-medium">By {item.instructorName}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 xs:mt-4">
                                                <span className="text-xl xs:text-2xl font-black text-zinc-900">₹{item.pricing}</span>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleDeleteCartItem(item.courseId)}
                                                    className="text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl min-w-[44px] min-h-[44px]"
                                                >
                                                    <Trash2 className="w-4 h-4 xs:w-5 xs:h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-[32px] xs:rounded-[40px] border-2 border-dashed border-zinc-200 p-10 xs:p-16 md:p-20 text-center"
                                >
                                    <div className="w-14 h-14 xs:w-20 xs:h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 xs:mb-6">
                                        <ShoppingBag className="w-7 h-7 xs:w-10 xs:h-10 text-zinc-300" />
                                    </div>
                                    <h2 className="text-xl xs:text-2xl font-bold text-zinc-900 mb-2">Cart is empty</h2>
                                    <p className="text-zinc-500 font-medium mb-6 xs:mb-8 text-sm xs:text-base">Start your journey by adding a course.</p>
                                    <Button onClick={() => navigate("/courses")} className="rounded-xl xs:rounded-2xl h-12 xs:h-14 px-6 xs:px-10 bg-zinc-900 font-bold w-full xs:w-auto">
                                        Explore Courses
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    {cartItems.length > 0 && (
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[32px] xs:rounded-[40px] border border-zinc-200/60 p-6 xs:p-8 md:p-10 shadow-xl lg:sticky lg:top-32"
                            >
                                <div className="space-y-4 xs:space-y-6 mb-6 xs:mb-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Amount</span>
                                        <span className="text-3xl xs:text-4xl font-black text-zinc-900 tracking-tighter">₹{calculateTotal()}</span>
                                    </div>
                                    <div className="h-px bg-zinc-100" />
                                    <p className="text-xs text-zinc-400 font-medium text-center">
                                        Taxes and discounts are calculated at checkout.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full h-14 xs:h-16 rounded-xl xs:rounded-2xl bg-zinc-900 text-white font-black text-base xs:text-lg flex items-center justify-center gap-3 shadow-2xl shadow-zinc-900/10 hover:shadow-zinc-900/20 active:scale-95 transition-all"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4 xs:w-5 xs:h-5" />
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartPage;
