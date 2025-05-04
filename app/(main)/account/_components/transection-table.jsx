"use client";

import { bulkDeleteTransactions } from "@/actions/accounts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { categoryColors } from "@/data/categories";
import useFetch from "@/hooks/use-fetch";
import { format } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const RECURING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
}

const TransectionTable = ({ transactions }) => {
  
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "data",
    direction: "desc",
  });

  
  const [searchItem, setSearchItem] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [recurringFilter, setRecurringFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter()
  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);
  
  
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

      // search filter
      if (searchItem) {
        const searchLower = searchItem.toLowerCase();
        result = result.filter((transaction) => 
          transaction.description?.toLowerCase().includes(searchLower)
        )
      }

      // recurring filter
      if (recurringFilter) {
        result = result.filter((transaction) => { 
            if (recurringFilter === "recurring") return transaction.isRecurring;
            return !transaction.isRecurring;
          }
        )
      }

      // type filter
      if (typeFilter) {
        result = result.filter((transaction) => transaction.type === typeFilter);
      }

      // apply sorting
      result.sort((a, b) => {
        let comparison = 0;

        switch (sortConfig.field) {
          case "date":
            comparison = new Date(a.date) - new Date(b.date);
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          default:
            comparison = 0;
        }

        return sortConfig.direction === "asc" ? comparison : -comparison;
      })

      return result;
    }, [
      transactions,
      searchItem,
      typeFilter,
      recurringFilter,
      sortConfig
    ]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };
  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };
  

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };


  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleFilterClears = () => {
    setSearchItem("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };

  return (
    <div className="space-y-4">

      { deleteLoading && ( <BarLoader className="mt-4" width={"100%"} color={"#9333ea"} /> )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input 
          className="pl-10" 
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder="Search transactions..."
          />
        </div>

        <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value) }>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recurring">Recurring Only</SelectItem>
            <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchItem || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleFilterClears}
              title="Clear Filters"
            > <X className="w-4 h-4" /> </Button>
          )}

        </div>      
      </div>


      {/* Transections */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead onClick={() => handleSort("date")} className="cursor-pointer">
                <div className="flex items-center">Date {" "} 
                  { sortConfig.field === "date" && 
                    (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                </div>
              </TableHead>
              <TableHead>
                Description 
              </TableHead>
              <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                <div className="flex items-center">
                  Category {" "}
                  { sortConfig.field === "category" && 
                    (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
                <div className="flex justify-end">
                  Amount {" "}
                  { sortConfig.field === "amount" && 
                    (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                  ))}
                </div> 
              </TableHead>
              <TableHead>Recuring</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>{ format(new Date(transaction.date), "PP") }</TableCell>
                  <TableCell>{ transaction.description }</TableCell>
                  <TableCell className="capitalize">
                    <span style={
                      {
                        backgroundColor: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 text-white rounded text-sm"
                      >
                      { transaction.category }
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium" style={{ color: transaction.type === "INCOME" ? "green" : "red" }}>
                    {transaction.type === "INCOME" ? "+" : "-"}
                    ₹{ transaction.amount.toFixed(2) }
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                        <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-600 hover:bg-purple-200">
                          <RefreshCw className="h-4 w-4" />
                          {RECURING_INTERVALS[transaction.recurringInterval]}
                        </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium"> Next Date:</div>
                            <div>{ format(new Date(transaction.nextRecurringDate), "PP") }</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>                    
                    ): (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-4 w-4" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`/transaction/create?edit=${transaction.id}`)
                        }}
                      >Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteFn([transaction.id])}
                      >Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  </TableCell>
                </TableRow> 
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

    </div>
  );
};

export default TransectionTable;
