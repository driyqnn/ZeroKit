
import React, { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { FileCode, Upload, Download, Filter, ArrowUpDown, Copy, RefreshCw, Search, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type for column definition
interface Column {
  key: string;
  name: string;
  type: "string" | "number" | "boolean" | "date";
  visible: boolean;
}

// Type for filter
interface Filter {
  column: string;
  operator: "contains" | "equals" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" | "between" | "isTrue" | "isFalse";
  value: string;
  value2?: string; // For "between" operator
}

const DataSorting = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [newFilter, setNewFilter] = useState<Filter>({
    column: "",
    operator: "contains",
    value: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [csvText, setCsvText] = useState("");
  
  // Function to import JSON data
  const importJSON = () => {
    try {
      if (!jsonText.trim()) {
        toast.error("Please enter some JSON data");
        return;
      }
      
      const parsedData = JSON.parse(jsonText);
      
      // Ensure the data is an array
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      if (dataArray.length === 0) {
        toast.error("No data found in the JSON");
        return;
      }
      
      // Extract columns from the first item
      const firstItem = dataArray[0];
      const extractedColumns: Column[] = Object.keys(firstItem).map((key) => {
        let type: "string" | "number" | "boolean" | "date" = "string";
        const value = firstItem[key];
        
        if (typeof value === "number") {
          type = "number";
        } else if (typeof value === "boolean") {
          type = "boolean";
        } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
          // Check if string can be parsed as a valid date
          type = "date";
        }
        
        return {
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          type,
          visible: true,
        };
      });
      
      setData(dataArray);
      setColumns(extractedColumns);
      // Reset other state
      setFilters([]);
      setSortConfig({ key: "", direction: null });
      setSearchTerm("");
      setNewFilter({
        column: extractedColumns.length > 0 ? extractedColumns[0].key : "",
        operator: "contains",
        value: "",
      });
      
      toast.success(`Imported ${dataArray.length} records`);
    } catch (error) {
      toast.error("Failed to parse JSON. Please check the format.");
    }
  };
  
  // Function to import CSV data
  const importCSV = () => {
    try {
      if (!csvText.trim()) {
        toast.error("Please enter some CSV data");
        return;
      }
      
      // Split by lines and filter out empty lines
      const lines = csvText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);
      
      if (lines.length < 2) {
        toast.error("CSV must contain headers and at least one data row");
        return;
      }
      
      // Parse headers (first line)
      const headers = lines[0].split(',').map(header => header.trim());
      
      // Parse data rows
      const parsedData = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length !== headers.length) {
          toast.error(`Row ${i + 1} has a different number of columns than the header`);
          return;
        }
        
        const row: any = {};
        headers.forEach((header, index) => {
          let value = values[index];
          
          // Try to convert to appropriate type
          if (value === "true" || value === "TRUE") {
            row[header] = true;
          } else if (value === "false" || value === "FALSE") {
            row[header] = false;
          } else if (!isNaN(Number(value)) && value.trim() !== "") {
            row[header] = Number(value);
          } else {
            row[header] = value;
          }
        });
        parsedData.push(row);
      }
      
      // Generate columns
      const extractedColumns: Column[] = headers.map(header => {
        // Determine type based on first data row
        let type: "string" | "number" | "boolean" | "date" = "string";
        const value = parsedData[0][header];
        
        if (typeof value === "number") {
          type = "number";
        } else if (typeof value === "boolean") {
          type = "boolean";
        } else if (typeof value === "string" && !isNaN(Date.parse(value))) {
          type = "date";
        }
        
        return {
          key: header,
          name: header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          type,
          visible: true,
        };
      });
      
      setData(parsedData);
      setColumns(extractedColumns);
      // Reset other state
      setFilters([]);
      setSortConfig({ key: "", direction: null });
      setSearchTerm("");
      setNewFilter({
        column: extractedColumns.length > 0 ? extractedColumns[0].key : "",
        operator: "contains",
        value: "",
      });
      
      toast.success(`Imported ${parsedData.length} records`);
    } catch (error) {
      toast.error("Failed to parse CSV. Please check the format.");
    }
  };
  
  // Helper function to correctly parse CSV lines (handling quoted values)
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result.map(value => value.trim().replace(/^"|"$/g, ""));
  };
  
  // Function to export data as JSON
  const exportJSON = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    // Only export visible columns
    const visibleData = data.map((row) => {
      const newRow: any = {};
      columns.filter(col => col.visible).forEach((col) => {
        newRow[col.key] = row[col.key];
      });
      return newRow;
    });
    
    const jsonString = JSON.stringify(visibleData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-export.json";
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported as JSON");
  };
  
  // Function to export data as CSV
  const exportCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const visibleColumns = columns.filter(col => col.visible);
    
    // Create header row
    let csv = visibleColumns.map(col => `"${col.key}"`).join(",") + "\n";
    
    // Add data rows
    const processedData = getProcessedData();
    processedData.forEach((row) => {
      const rowValues = visibleColumns.map((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) {
          return '""';
        } else if (typeof value === "string") {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return `"${value}"`;
        }
      });
      csv += rowValues.join(",") + "\n";
    });
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported as CSV");
  };
  
  // Function to toggle column visibility
  const toggleColumnVisibility = (key: string) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };
  
  // Function to add a filter
  const addFilter = () => {
    if (!newFilter.column || !newFilter.value && newFilter.operator !== "isTrue" && newFilter.operator !== "isFalse") {
      toast.error("Please fill in all filter fields");
      return;
    }
    
    setFilters([...filters, { ...newFilter }]);
    setNewFilter({
      column: newFilter.column,
      operator: "contains",
      value: "",
    });
    
    toast.success("Filter added");
  };
  
  // Function to remove a filter
  const removeFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };
  
  // Function to handle sorting
  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };
  
  // Apply search, filters and sorting to get processed data
  const getProcessedData = () => {
    let processedData = [...data];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      processedData = processedData.filter((row) =>
        Object.entries(row).some(([key, value]) => {
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(term);
        })
      );
    }
    
    // Apply filters
    filters.forEach((filter) => {
      const column = columns.find((col) => col.key === filter.column);
      if (!column) return;
      
      processedData = processedData.filter((row) => {
        const value = row[filter.column];
        const filterValue = filter.value;
        
        switch (filter.operator) {
          case "contains":
            return String(value).toLowerCase().includes(filterValue.toLowerCase());
          case "equals":
            return String(value).toLowerCase() === filterValue.toLowerCase();
          case "startsWith":
            return String(value).toLowerCase().startsWith(filterValue.toLowerCase());
          case "endsWith":
            return String(value).toLowerCase().endsWith(filterValue.toLowerCase());
          case "greaterThan":
            if (column.type === "number") {
              return Number(value) > Number(filterValue);
            } else if (column.type === "date") {
              return new Date(value) > new Date(filterValue);
            }
            return false;
          case "lessThan":
            if (column.type === "number") {
              return Number(value) < Number(filterValue);
            } else if (column.type === "date") {
              return new Date(value) < new Date(filterValue);
            }
            return false;
          case "between":
            if (!filter.value2) return true;
            if (column.type === "number") {
              const num = Number(value);
              return num >= Number(filterValue) && num <= Number(filter.value2);
            } else if (column.type === "date") {
              const date = new Date(value);
              return date >= new Date(filterValue) && date <= new Date(filter.value2);
            }
            return false;
          case "isTrue":
            return Boolean(value) === true;
          case "isFalse":
            return Boolean(value) === false;
          default:
            return true;
        }
      });
    });
    
    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (column) {
        processedData.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];
          
          // Handle different column types
          if (column.type === "number") {
            aValue = Number(aValue);
            bValue = Number(bValue);
          } else if (column.type === "date") {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          } else if (column.type === "boolean") {
            aValue = Boolean(aValue);
            bValue = Boolean(bValue);
          } else {
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
          }
          
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
    }
    
    return processedData;
  };
  
  // Generate example data for testing
  const generateExampleData = () => {
    const exampleData = [
      {
        id: 1,
        name: "John Smith",
        email: "john@example.com",
        age: 32,
        isActive: true,
        joinDate: "2020-01-15",
        score: 85.5
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        age: 28,
        isActive: true,
        joinDate: "2019-11-20",
        score: 92.0
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 45,
        isActive: false,
        joinDate: "2018-03-10",
        score: 67.8
      },
      {
        id: 4,
        name: "Alice Brown",
        email: "alice@example.com",
        age: 24,
        isActive: true,
        joinDate: "2021-07-05",
        score: 78.3
      },
      {
        id: 5,
        name: "Charlie Wilson",
        email: "charlie@example.com",
        age: 37,
        isActive: false,
        joinDate: "2017-09-28",
        score: 81.2
      }
    ];
    
    const extractedColumns: Column[] = [
      { key: "id", name: "ID", type: "number", visible: true },
      { key: "name", name: "Name", type: "string", visible: true },
      { key: "email", name: "Email", type: "string", visible: true },
      { key: "age", name: "Age", type: "number", visible: true },
      { key: "isActive", name: "Is Active", type: "boolean", visible: true },
      { key: "joinDate", name: "Join Date", type: "date", visible: true },
      { key: "score", name: "Score", type: "number", visible: true },
    ];
    
    setData(exampleData);
    setColumns(extractedColumns);
    setJsonText(JSON.stringify(exampleData, null, 2));
    
    const csvHeader = "id,name,email,age,isActive,joinDate,score";
    const csvRows = exampleData.map(item => 
      `${item.id},"${item.name}","${item.email}",${item.age},${item.isActive},"${item.joinDate}",${item.score}`
    );
    setCsvText([csvHeader, ...csvRows].join("\n"));
    
    // Reset other state
    setFilters([]);
    setSortConfig({ key: "", direction: null });
    setSearchTerm("");
    setNewFilter({
      column: "name",
      operator: "contains",
      value: "",
    });
    
    toast.success("Example data loaded");
  };
  
  // Get the processed data for display
  const processedData = getProcessedData();
  const visibleColumns = columns.filter(col => col.visible);
  
  // Format cell value based on column type
  const formatCellValue = (value: any, type: string) => {
    if (value === undefined || value === null) {
      return "-";
    }
    
    switch (type) {
      case "boolean":
        return value ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />;
      case "date":
        try {
          const date = new Date(value);
          return date.toLocaleDateString();
        } catch {
          return String(value);
        }
      default:
        return String(value);
    }
  };
  
  // Determine available operators based on column type
  const getOperatorsForType = (type: string) => {
    switch (type) {
      case "number":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "Greater than" },
          { value: "lessThan", label: "Less than" },
          { value: "between", label: "Between" },
        ];
      case "boolean":
        return [
          { value: "isTrue", label: "Is true" },
          { value: "isFalse", label: "Is false" },
        ];
      case "date":
        return [
          { value: "equals", label: "Equals" },
          { value: "greaterThan", label: "After" },
          { value: "lessThan", label: "Before" },
          { value: "between", label: "Between" },
        ];
      default:
        return [
          { value: "contains", label: "Contains" },
          { value: "equals", label: "Equals" },
          { value: "startsWith", label: "Starts with" },
          { value: "endsWith", label: "Ends with" },
        ];
    }
  };

  return (
    <ToolLayout
      title="Data Sorting & Filtering"
      description="Sort and filter data sets with advanced options and visualizations"
      icon={<FileCode className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-7xl mx-auto">
        {/* Data Import/Export */}
        <Tabs defaultValue="import" className="mb-6">
          <TabsList>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>
                  Import data from JSON or CSV format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="json">
                  <TabsList className="mb-4">
                    <TabsTrigger value="json">JSON</TabsTrigger>
                    <TabsTrigger value="csv">CSV</TabsTrigger>
                    <TabsTrigger value="example">Example Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="json">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Enter JSON Array:</label>
                        <textarea
                          value={jsonText}
                          onChange={(e) => setJsonText(e.target.value)}
                          placeholder='[{"id": 1, "name": "John", "age": 30}, {"id": 2, "name": "Jane", "age": 25}]'
                          className="w-full h-48 p-3 border rounded-md bg-muted/30 font-mono text-sm resize-none"
                        />
                      </div>
                      
                      <Button onClick={importJSON}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import JSON
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="csv">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Enter CSV Data:</label>
                        <textarea
                          value={csvText}
                          onChange={(e) => setCsvText(e.target.value)}
                          placeholder="id,name,age\n1,John,30\n2,Jane,25"
                          className="w-full h-48 p-3 border rounded-md bg-muted/30 font-mono text-sm resize-none"
                        />
                      </div>
                      
                      <Button onClick={importCSV}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import CSV
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="example">
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="mb-4 text-center text-muted-foreground">
                        Generate a sample dataset to test the functionality of this tool
                      </p>
                      
                      <Button onClick={generateExampleData}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate Example Data
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <CardDescription>
                  Export filtered and sorted data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Button onClick={exportJSON} disabled={data.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as JSON
                    </Button>
                    
                    <Button onClick={exportCSV} disabled={data.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as CSV
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {processedData.length} of {data.length} records will be exported
                    {filters.length > 0 && ` (filtered)`}
                    {sortConfig.direction && ` (sorted)`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Data Filtering and View */}
        {data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Search Bar */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search across all fields..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    
                    {/* Column Visibility Toggle */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          Columns
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {columns.map((col) => (
                          <DropdownMenuItem
                            key={col.key}
                            onClick={() => toggleColumnVisibility(col.key)}
                            className="flex items-center gap-2"
                          >
                            <div className={`h-4 w-4 border rounded flex items-center justify-center ${
                              col.visible ? "bg-primary border-primary" : "bg-transparent"
                            }`}>
                              {col.visible && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            {col.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
              
              {/* Data Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Data Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Records:</span>
                      <span className="font-medium">{data.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Filtered Records:</span>
                      <span className="font-medium">{processedData.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Filters:</span>
                      <span className="font-medium">{filters.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Columns:</span>
                      <span className="font-medium">{visibleColumns.length} visible / {columns.length} total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Filter Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>
                  Add filters to narrow down your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Active Filters */}
                  {filters.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Active Filters</h4>
                      <div className="flex flex-wrap gap-2">
                        {filters.map((filter, index) => {
                          const column = columns.find((c) => c.key === filter.column);
                          return (
                            <div 
                              key={index}
                              className="bg-muted/50 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                            >
                              <span>{column?.name || filter.column}</span>
                              <span className="text-muted-foreground">{filter.operator}</span>
                              <span>{
                                filter.operator === "isTrue" ? "true" :
                                filter.operator === "isFalse" ? "false" :
                                filter.value + (filter.value2 ? ` to ${filter.value2}` : "")
                              }</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFilter(index)}
                                className="h-4 w-4 rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Add New Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Column</label>
                      <Select
                        value={newFilter.column}
                        onValueChange={(value) => {
                          const column = columns.find((c) => c.key === value);
                          if (column) {
                            const operators = getOperatorsForType(column.type);
                            setNewFilter({
                              column: value,
                              operator: operators[0].value as any,
                              value: "",
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {columns.map((col) => (
                            <SelectItem key={col.key} value={col.key}>
                              {col.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Condition</label>
                      <Select
                        value={newFilter.operator}
                        onValueChange={(value) => setNewFilter({ ...newFilter, operator: value as any, value: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {newFilter.column && columns.find(c => c.key === newFilter.column)?.type &&
                            getOperatorsForType(columns.find(c => c.key === newFilter.column)?.type || "string").map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {newFilter.operator !== "isTrue" && newFilter.operator !== "isFalse" && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Value</label>
                          {columns.find(c => c.key === newFilter.column)?.type === "date" ? (
                            <Input
                              type="date"
                              value={newFilter.value}
                              onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                            />
                          ) : (
                            <Input
                              type={columns.find(c => c.key === newFilter.column)?.type === "number" ? "number" : "text"}
                              value={newFilter.value}
                              onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                              placeholder="Enter value"
                            />
                          )}
                        </div>
                        
                        {newFilter.operator === "between" && (
                          <div>
                            <label className="text-sm font-medium mb-1 block">Second Value</label>
                            {columns.find(c => c.key === newFilter.column)?.type === "date" ? (
                              <Input
                                type="date"
                                value={newFilter.value2 || ""}
                                onChange={(e) => setNewFilter({ ...newFilter, value2: e.target.value })}
                              />
                            ) : (
                              <Input
                                type={columns.find(c => c.key === newFilter.column)?.type === "number" ? "number" : "text"}
                                value={newFilter.value2 || ""}
                                onChange={(e) => setNewFilter({ ...newFilter, value2: e.target.value })}
                                placeholder="Enter second value"
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className={`${newFilter.operator === "between" ? "md:col-span-4" : (newFilter.operator === "isTrue" || newFilter.operator === "isFalse") ? "md:col-span-3" : "md:col-span-1"} flex items-end`}>
                      <Button onClick={addFilter} className="w-full md:w-auto">
                        <Filter className="h-4 w-4 mr-2" />
                        Add Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Data View</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Showing {processedData.length} of {data.length} records
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="relative max-h-[500px] overflow-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                          {visibleColumns.map((column) => (
                            <TableHead key={column.key} className="relative">
                              <div
                                className="flex items-center cursor-pointer"
                                onClick={() => handleSort(column.key)}
                              >
                                {column.name}
                                <div className="ml-2 flex flex-col">
                                  {sortConfig.key === column.key && sortConfig.direction === "ascending" && (
                                    <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
                                  )}
                                  {sortConfig.key === column.key && sortConfig.direction === "descending" && (
                                    <ArrowUpDown className="h-3.5 w-3.5 text-primary rotate-180" />
                                  )}
                                  {(sortConfig.key !== column.key || !sortConfig.direction) && (
                                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground opacity-40" />
                                  )}
                                </div>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {processedData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                              No results found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          processedData.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {visibleColumns.map((column) => (
                                <TableCell key={`${rowIndex}-${column.key}`}>
                                  {formatCellValue(row[column.key], column.type)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Quick Copy to Clipboard Button */}
                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const headers = visibleColumns.map(col => col.name).join('\t');
                      const rows = processedData.map(row => 
                        visibleColumns.map(col => row[col.key]).join('\t')
                      ).join('\n');
                      const text = `${headers}\n${rows}`;
                      
                      navigator.clipboard.writeText(text);
                      toast.success("Table data copied to clipboard");
                    }}
                    disabled={processedData.length === 0}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Table
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default DataSorting;
