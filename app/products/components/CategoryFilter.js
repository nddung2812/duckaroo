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
        return "text-green-700 hover:text-green-800 hover:bg-green-50";
      case "livestock":
        return "text-teal-700 hover:text-teal-800 hover:bg-teal-50";
      case "probiotics":
        return "text-blue-700 hover:text-blue-800 hover:bg-blue-50";
      case "accessories":
        return "text-purple-700 hover:text-purple-800 hover:bg-purple-50";
      default:
        return "text-gray-700 hover:text-gray-800 hover:bg-gray-50";
    }
  };

  const getActiveCategoryStyle = (categoryId) => {
    if (selectedCategory === categoryId) {
      switch (categoryId) {
        case "plants":
          return "bg-green-100 text-green-800 border-green-300";
        case "livestock":
          return "bg-teal-100 text-teal-800 border-teal-300";
        case "probiotics":
          return "bg-blue-100 text-blue-800 border-blue-300";
        case "accessories":
          return "bg-purple-100 text-purple-800 border-purple-300";
        case "all":
          return "bg-gray-100 text-gray-800 border-gray-300";
        default:
          return "bg-gray-100 text-gray-800 border-gray-300";
      }
    }
    return "bg-white hover:bg-gray-50 border-gray-200";
  };

  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Search & Filter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Search Products</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 py-2 text-sm border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          {searchTerm && (
            <div className="text-xs text-gray-600">
              Searching:{" "}
              <span className="font-medium">&ldquo;{searchTerm}&rdquo;</span>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                className={`w-full justify-between p-3 h-auto ${getActiveCategoryStyle(
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
                  className="ml-auto bg-gray-200 text-gray-700"
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
