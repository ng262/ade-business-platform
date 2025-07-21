import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-2">403 - Forbidden</h1>
      <p className="text-muted-foreground mb-6">
        You don’t have permission to access this page.
      </p>
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}
