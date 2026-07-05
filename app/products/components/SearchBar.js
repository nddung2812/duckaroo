import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ searchTerm, onSearchChange }) {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/40 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 py-3 text-lg rounded-full bg-abyss/40 border-2 border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-2 focus:ring-amber-glow/40"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-cream/70 hover:bg-cream/10 hover:text-cream rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 text-sm text-cream/60">
          Searching for:{" "}
          <span className="font-medium">&ldquo;{searchTerm}&rdquo;</span>
        </div>
      )}
    </div>
  );
}
