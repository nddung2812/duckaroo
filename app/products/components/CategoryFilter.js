import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Leaf, Droplet, Wrench, Search, X, Fish } from "lucide-react";
export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  categories = [],
}) {
  const handleClearSearch = () => {
    onSearchChange("");
  };

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "plants":
        return <Leaf className="w-5 h-5" />;
      case "livestock":
        return <Fish className="w-5 h-5" />;
      case "probiotics":
        return <Droplet className="w-5 h-5" />;
      case "accessories":
        return <Wrench className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (categoryId) => {
    switch (categoryId) {
      case "plants":
        return "text-cream/80 hover:text-amber-glow hover:bg-cream/5";
      case "livestock":
        return "text-cream/80 hover:text-amber-glow hover:bg-cream/5";
      case "probiotics":
        return "text-cream/80 hover:text-amber-glow hover:bg-cream/5";
      case "accessories":
        return "text-cream/80 hover:text-amber-glow hover:bg-cream/5";
      default:
        return "text-cream/80 hover:text-amber-glow hover:bg-cream/5";
    }
  };

  const getActiveCategoryStyle = (categoryId) => {
    if (selectedCategory === categoryId) {
      switch (categoryId) {
        case "plants":
          return "bg-moss/60 text-amber-glow border-amber-glow/40";
        case "livestock":
          return "bg-moss/60 text-amber-glow border-amber-glow/40";
        case "probiotics":
          return "bg-moss/60 text-amber-glow border-amber-glow/40";
        case "accessories":
          return "bg-moss/60 text-amber-glow border-amber-glow/40";
        case "all":
          return "bg-moss/60 text-amber-glow border-amber-glow/40";
        default:
          return "bg-moss/60 text-amber-glow border-amber-glow/40";
      }
    }
    return "bg-transparent hover:bg-cream/5 border-cream/20";
  };

  return (
    <Card className="lg:sticky lg:top-4 rounded-2xl bg-cream/5 border-cream/15 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="font-display text-lg font-medium text-parchment">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-cream/70">Search Products</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/40 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 py-2 text-sm rounded-full bg-abyss/40 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-amber-glow focus:ring-1 focus:ring-amber-glow/40"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-cream/70 hover:bg-cream/10 hover:text-cream rounded-full"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {searchTerm && (
            <div className="text-xs text-cream/60">
              Searching:{" "}
              <span className="font-medium">&ldquo;{searchTerm}&rdquo;</span>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-cream/70">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className={`w-full justify-between p-3 h-auto rounded-full ${getActiveCategoryStyle(
                  category.id
                )} ${getCategoryColor(category.id)}`}
                onClick={() => onCategoryChange(category.id)}
              >
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(category.id)}
                  <span className="font-medium">{category.name}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-moss/60 border border-cream/20 text-cream/75"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
