import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, Search, MessageCircle, ArrowLeft } from "lucide-react";
import DiscordIcon from "./icons/DiscordIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearchTools } from "@/hooks/useSearchTools";

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { searchTools, results } = useSearchTools();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && results.length > 0) {
      navigate(`/tools/${results[0].slug}`);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchTools(value);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner">
      <div className="container max-w-screen-2xl mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
            aria-label="ZeroKit - Go to homepage">
            <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center border border-primary/30">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold hidden sm:block">
              <span className="text-white">Zero</span>
              <span className="text-primary">Kit</span>
            </h1>
          </Link>

          <form
            onSubmit={handleSearch}
            className={cn(
              "relative transition-all duration-300 ease-in-out",
              isSearchFocused ? "w-full md:w-96" : "w-40 md:w-64"
            )}>
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-8 bg-muted/50 border-muted focus:border-primary"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            {isSearchFocused && searchTerm && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto">
                {results.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSearchTerm("");
                      setIsSearchFocused(false);
                    }}>
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                      <tool.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tool.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {tool.description}
                      </p>
                    </div>
                    {tool.isNew && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                    {tool.isPopular && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            asChild>
            <a
              href="https://discord.gg/XDqV2ucEpP"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join our Discord community">
              <DiscordIcon className="h-5 w-5" />
            </a>
          </Button>

          <Button
            variant="default"
            size="sm"
            className="ml-2 hidden sm:flex"
            asChild>
            <a
              href="https://discord.com/users/929998586375180288"
              target="_blank"
              rel="noopener noreferrer">
              <ArrowLeft className="h-4 w-4 inline-block" /> Found a bug? Chat
              with me
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
