import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-semibold text-[#0067b8] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-black mb-2">Page not found</h2>
      <p className="text-[#616161] font-normal mb-8 max-w-md">
        We're sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-[#0067b8] text-white hover:bg-[#005a9e] rounded-sm h-12 px-8 font-semibold transition-none"
      >
        Go back home
      </Button>
    </div>
  );
}

export default NotFoundPage;
