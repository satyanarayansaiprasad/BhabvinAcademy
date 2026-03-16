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
    <div className="bg-[#f2f2f2] min-h-screen pt-20 xs:pt-24 md:pt-32 pb-16">
      <div className="container mx-auto px-4 xs:px-6">
        <div className="mb-10">
          <h1 className="text-3xl xs:text-4xl md:text-5xl font-semibold tracking-tight text-black mb-2">Shopping Cart</h1>
          <p className="text-[#616161] font-normal text-sm xs:text-base">
            {cartItems.length} course{cartItems.length !== 1 ? "s" : ""} in your selection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.courseId}
                  className="bg-white rounded-sm border border-[#e6e6e6] p-4 flex flex-col xs:flex-row gap-6 shadow-sm group"
                >
                  <div className="w-full xs:w-48 h-32 rounded-sm overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-1 leading-tight group-hover:text-[#0067b8] transition-colors">{item.title}</h3>
                      <p className="text-xs font-normal text-[#616161]">By <span className="text-black font-semibold">{item.instructorName}</span></p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-black">₹{item.pricing}</span>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeleteCartItem(item.courseId)}
                        className="text-[#616161] hover:text-red-600 hover:bg-red-50 rounded-sm p-2 transition-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-sm border border-[#e6e6e6] p-20 text-center">
                <div className="w-16 h-16 bg-[#f2f2f2] rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-8 h-8 text-[#d2d2d2]" />
                </div>
                <h2 className="text-xl font-semibold text-black mb-2">Your cart is empty</h2>
                <p className="text-[#616161] font-normal mb-8 text-sm">Start your journey by adding a course.</p>
                <Button onClick={() => navigate("/courses")} className="rounded-sm h-12 px-8 bg-black text-white font-semibold transition-none">
                  Explore Courses
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm border border-[#e6e6e6] p-8 shadow-sm lg:sticky lg:top-32">
                <div className="space-y-6 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[#616161] font-semibold uppercase tracking-wider text-[10px]">Total Amount</span>
                    <span className="text-3xl font-bold text-black tracking-tight">₹{calculateTotal()}</span>
                  </div>
                  <div className="h-px bg-[#f2f2f2]" />
                  <p className="text-[10px] text-[#616161] font-normal text-center">
                    Taxes and discounts are calculated at checkout.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/checkout")}
                  className="w-full h-14 rounded-sm bg-[#0067b8] hover:bg-[#005a9e] text-white font-semibold text-base flex items-center justify-center gap-3 transition-none"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
}

export default CartPage;
