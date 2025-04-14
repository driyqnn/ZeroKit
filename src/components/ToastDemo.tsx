
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ToastDemo = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
      className: "bg-privy-teal text-privy-offwhite",
      duration: 3000,
    });
  };

  const showWarningToast = () => {
    toast({
      title: "Warning",
      description: "This action might have consequences.",
      className: "bg-privy-amber text-privy-offwhite",
      duration: 3000,
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      className: "bg-privy-crimson text-privy-offwhite",
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-8">
      <Button onClick={showSuccessToast} className="bg-privy-teal hover:bg-privy-teal/90">
        Success Toast
      </Button>
      <Button onClick={showWarningToast} className="bg-privy-amber hover:bg-privy-amber/90">
        Warning Toast
      </Button>
      <Button onClick={showErrorToast} className="bg-privy-crimson hover:bg-privy-crimson/90">
        Error Toast
      </Button>
    </div>
  );
};

export default ToastDemo;
