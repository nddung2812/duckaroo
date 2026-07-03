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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          Searching for:{" "}
          <span className="font-medium">&ldquo;{searchTerm}&rdquo;</span>
        </div>
      )}
    </div>
  );
}
