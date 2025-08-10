import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  type: 'books' | 'videos';
}

export default function SearchFilters({ filters, onFiltersChange, type }: SearchFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      <div className="flex-1">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <Input
            type="text"
            placeholder={`Search ${type}...`}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
      </div>
      
      {type === 'books' && (
        <>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Personal Development">Personal Development</SelectItem>
              <SelectItem value="Business Strategy">Business Strategy</SelectItem>
            </SelectContent>
          </Select>

          <Select value={`${filters.minPrice}-${filters.maxPrice}`} onValueChange={(value) => {
            const [min, max] = value.split('-');
            updateFilter('minPrice', min);
            updateFilter('maxPrice', max);
          }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">All Prices</SelectItem>
              <SelectItem value="0-20">$0 - $20</SelectItem>
              <SelectItem value="20-40">$20 - $40</SelectItem>
              <SelectItem value="40-">$40+</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {type === 'videos' && (
        <Select value={filters.platform} onValueChange={(value) => updateFilter('platform', value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Platforms</SelectItem>
            <SelectItem value="YouTube">YouTube</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
        const [sortBy, sortOrder] = value.split('-');
        updateFilter('sortBy', sortBy);
        updateFilter('sortOrder', sortOrder);
      }}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="title-asc">Title A-Z</SelectItem>
          <SelectItem value="title-desc">Title Z-A</SelectItem>
          {type === 'books' && (
            <>
              <SelectItem value="price-asc">Price Low to High</SelectItem>
              <SelectItem value="price-desc">Price High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </>
          )}
          {type === 'videos' && (
            <SelectItem value="views-desc">Most Views</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
