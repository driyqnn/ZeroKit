import { Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="border-t border-border/40 py-6 bg-background"
      role="contentinfo">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">
              <span className="text-white">Zero</span>
              <span className="text-primary">Kit</span>
            </h2>
          </div>

          <p className="text-sm text-muted-foreground text-center md:text-left flex items-center gap-1">
            Built and designed with{" "}
            <Heart className="h-4 w-4 text-red-400 fill-red-400" /> by
            <a
              href="https://discord.com/users/929998586375180288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors ml-1">
              @driyqnn
            </a>
          </p>

          <div className="text-sm text-muted-foreground">
            © 2025 ZeroKit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
