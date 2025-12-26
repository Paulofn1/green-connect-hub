import { Search, Filter, Tags, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CRMFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CRMFilters({ searchQuery, onSearchChange }: CRMFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Tags className="w-4 h-4" />
          Tags
        </Button>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Contato
        </Button>
      </div>
    </div>
  );
}