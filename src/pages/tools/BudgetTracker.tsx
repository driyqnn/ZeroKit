
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Layers, Plus, Trash2, PieChart, Download, DollarSign, ArrowUp, ArrowDown, Calendar, Filter, Clock, TrendingUp, Wallet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from "recharts";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from "@/hooks/use-local-storage";
import { format, parse, startOfMonth, endOfMonth, isWithinInterval, subMonths, addMonths, isAfter, isBefore, formatDistanceToNow, isSameMonth } from "date-fns";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string; // ISO date string
}

interface Budget {
  id: string;
  category: string;
  limit: number;
}

const DEFAULT_CATEGORIES = {
  income: ["Salary", "Freelance", "Gifts", "Investments", "Other Income"],
  expense: ["Housing", "Food", "Transportation", "Utilities", "Entertainment", "Healthcare", "Shopping", "Education", "Personal", "Other"]
};

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#D946EF', '#F97316', '#14B8A6'];

// Helper functions
const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const calculateDailyExpenses = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  const dailyData: { [key: string]: number } = {};
  const currentDate = new Date(startDate);
  
  // Initialize all days with zero
  while (currentDate <= endDate) {
    dailyData[format(currentDate, 'yyyy-MM-dd')] = 0;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sum up daily expenses
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const transDate = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (dailyData[transDate] !== undefined) {
        dailyData[transDate] += transaction.amount;
      }
    }
  });
  
  // Convert to chart data format
  return Object.keys(dailyData).map(date => ({
    date: format(new Date(date), 'MMM dd'),
    amount: dailyData[date]
  }));
};

const getMonthlyTrends = (transactions: Transaction[], monthsToShow: number = 6) => {
  const monthlyData: { [key: string]: { income: number, expense: number } } = {};
  
  // Get start and end dates
  const endDate = new Date();
  const startDate = subMonths(endDate, monthsToShow - 1);
  
  // Initialize all months with zero
  let currentDate = new Date(startDate);
  while (isBefore(currentDate, endDate) || isSameMonth(currentDate, endDate)) {
    const monthKey = format(currentDate, 'yyyy-MM');
    monthlyData[monthKey] = { income: 0, expense: 0 };
    currentDate = addMonths(currentDate, 1);
  }
  
  // Sum up monthly income and expenses
  transactions.forEach(transaction => {
    const transDate = new Date(transaction.date);
    if (isAfter(transDate, startDate) || isSameMonth(transDate, startDate)) {
      const monthKey = format(transDate, 'yyyy-MM');
      if (monthlyData[monthKey]) {
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expense += transaction.amount;
        }
      }
    }
  });
  
  // Convert to chart data format
  return Object.keys(monthlyData).map(month => ({
    month: format(new Date(month), 'MMM yy'),
    income: monthlyData[month].income,
    expense: monthlyData[month].expense,
    savings: monthlyData[month].income - monthlyData[month].expense
  }));
};

const analyzeSpendingPatterns = (transactions: Transaction[]) => {
  // Only look at expense transactions
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Group by day of week
  const dayOfWeekData: { [key: string]: number } = {
    'Sunday': 0,
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0
  };
  
  // Group by time of day (morning, afternoon, evening)
  const timeOfDayData: { [key: string]: number } = {
    'Morning (5AM-12PM)': 0,
    'Afternoon (12PM-5PM)': 0,
    'Evening (5PM-10PM)': 0,
    'Night (10PM-5AM)': 0
  };
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    
    // Day of week
    const dayOfWeek = format(date, 'EEEE');
    dayOfWeekData[dayOfWeek] += expense.amount;
    
    // Time of day
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
      timeOfDayData['Morning (5AM-12PM)'] += expense.amount;
    } else if (hour >= 12 && hour < 17) {
      timeOfDayData['Afternoon (12PM-5PM)'] += expense.amount;
    } else if (hour >= 17 && hour < 22) {
      timeOfDayData['Evening (5PM-10PM)'] += expense.amount;
    } else {
      timeOfDayData['Night (10PM-5AM)'] += expense.amount;
    }
  });
  
  // Convert to chart data format
  const dayOfWeekChart = Object.keys(dayOfWeekData).map(day => ({
    name: day.substring(0, 3),
    amount: dayOfWeekData[day]
  }));
  
  const timeOfDayChart = Object.keys(timeOfDayData).map(time => ({
    name: time,
    amount: timeOfDayData[time]
  }));
  
  return { dayOfWeekChart, timeOfDayChart };
};

const BudgetTracker = () => {
  // Local storage states
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("budget_transactions", []);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>("budget_budgets", []);
  const [customCategories, setCustomCategories] = useLocalStorage<{income: string[], expense: string[]}>("budget_categories", DEFAULT_CATEGORIES);
  
  // Form states
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [transactionCategory, setTransactionCategory] = useState<string>("");
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [transactionDescription, setTransactionDescription] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  
  // Budget form states
  const [budgetCategory, setBudgetCategory] = useState<string>("");
  const [budgetLimit, setBudgetLimit] = useState<string>("");
  
  // Category form
  const [newCategory, setNewCategory] = useState<string>("");
  const [categoryType, setCategoryType] = useState<"income" | "expense">("expense");
  
  // Filter states
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  
  // Stats
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [dailyExpenses, setDailyExpenses] = useState<any[]>([]);
  const [spendingPatterns, setSpendingPatterns] = useState<{
    dayOfWeekChart: any[];
    timeOfDayChart: any[];
  }>({ dayOfWeekChart: [], timeOfDayChart: [] });
  
  // Apply filters and calculate statistics
  useEffect(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const withinDateRange = isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
      const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
      const matchesType = filterType === "all" || transaction.type === filterType;
      
      return withinDateRange && matchesCategory && matchesType;
    });
    
    setFilteredTransactions(filtered);
    setStats(calculateTotals(filtered));
    
    // Generate category data for charts
    const categoryTotals: {[key: string]: number} = {};
    
    filtered.forEach(transaction => {
      if (transaction.type === "expense") {
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += transaction.amount;
      }
    });
    
    const chartData = Object.keys(categoryTotals).map(category => ({
      name: category,
      value: categoryTotals[category]
    }));
    
    setCategoryData(chartData);
    
    // Calculate monthly trends
    setMonthlyTrends(getMonthlyTrends(transactions));
    
    // Calculate daily expenses for current month
    setDailyExpenses(calculateDailyExpenses(transactions, monthStart, monthEnd));
    
    // Analyze spending patterns
    setSpendingPatterns(analyzeSpendingPatterns(transactions));
  }, [transactions, selectedMonth, filterCategory, filterType]);
  
  // Default selected category when transaction type changes
  useEffect(() => {
    if (customCategories[transactionType].length > 0) {
      setTransactionCategory(customCategories[transactionType][0]);
    } else {
      setTransactionCategory("");
    }
  }, [transactionType, customCategories]);
  
  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionCategory) {
      toast.error("Please select a category for this transaction");
      return;
    }
    
    if (!transactionAmount || isNaN(parseFloat(transactionAmount)) || parseFloat(transactionAmount) <= 0) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }
    
    const newTransaction: Transaction = {
      id: uuidv4(),
      type: transactionType,
      category: transactionCategory,
      amount: parseFloat(transactionAmount),
      description: transactionDescription,
      date: transactionDate.toISOString()
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Reset form
    setTransactionAmount("");
    setTransactionDescription("");
    setTransactionDate(new Date());
    
    toast.success(`${transactionType === "income" ? "Income" : "Expense"} of ${formatCurrency(parseFloat(transactionAmount))} added successfully`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted successfully");
  };
  
  const handleSubmitBudget = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetCategory) {
      toast.error("Please select a category for this budget");
      return;
    }
    
    if (!budgetLimit || isNaN(parseFloat(budgetLimit)) || parseFloat(budgetLimit) <= 0) {
      toast.error("Please enter a valid budget limit greater than zero");
      return;
    }
    
    // Check if budget for this category already exists
    const existingBudget = budgets.find(budget => budget.category === budgetCategory);
    
    if (existingBudget) {
      // Update existing budget
      setBudgets(
        budgets.map(budget => 
          budget.id === existingBudget.id 
            ? { ...budget, limit: parseFloat(budgetLimit) } 
            : budget
        )
      );
      toast.success(`Budget for ${budgetCategory} updated to ${formatCurrency(parseFloat(budgetLimit))}`);
    } else {
      // Create new budget
      const newBudget: Budget = {
        id: uuidv4(),
        category: budgetCategory,
        limit: parseFloat(budgetLimit)
      };
      
      setBudgets([...budgets, newBudget]);
      toast.success(`Budget for ${budgetCategory} set to ${formatCurrency(parseFloat(budgetLimit))}`);
    }
    
    // Reset form
    setBudgetLimit("");
  };
  
  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    toast.success("Budget deleted successfully");
  };
  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory) {
      toast.error("Please enter a category name");
      return;
    }
    
    if (customCategories[categoryType].includes(newCategory)) {
      toast.error(`Category '${newCategory}' already exists`);
      return;
    }
    
    setCustomCategories({
      ...customCategories,
      [categoryType]: [...customCategories[categoryType], newCategory]
    });
    
    // Reset form
    setNewCategory("");
    toast.success(`Category '${newCategory}' added successfully`);
  };

  const exportTransactions = () => {
    // Prepare transactions data
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create download link
    const exportFileDefaultName = `budget-transactions-${format(new Date(), 'yyyy-MM-dd')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Transaction data exported successfully");
  };
  
  const getMonthlyBudgetStatus = () => {
    // Get expenses for current month only
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    
    const monthlyExpenses = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transaction.type === "expense" && 
        isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });
    
    // Calculate total spent by category
    const spentByCategory: {[key: string]: number} = {};
    monthlyExpenses.forEach(expense => {
      if (!spentByCategory[expense.category]) {
        spentByCategory[expense.category] = 0;
      }
      spentByCategory[expense.category] += expense.amount;
    });
    
    // Compare with budgets
    return budgets.map(budget => {
      const spent = spentByCategory[budget.category] || 0;
      const percentage = (spent / budget.limit) * 100;
      const remaining = budget.limit - spent;
      
      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining,
        percentage: Math.min(percentage, 100), // Cap at 100% for the progress bar
        isOverBudget: percentage > 100
      };
    });
  };
  
  const budgetStatus = getMonthlyBudgetStatus();
  
  return (
    <ToolLayout
      title="Budget Tracker"
      description="Track your income and expenses, set budgets, and visualize your financial data"
      icon={<Layers className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="dashboard" className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Income</CardTitle>
                  <ArrowUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.income)}</div>
                  <p className="text-xs text-muted-foreground">For {format(selectedMonth, 'MMMM yyyy')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                  <ArrowDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.expenses)}</div>
                  <p className="text-xs text-muted-foreground">For {format(selectedMonth, 'MMMM yyyy')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stats.balance < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(stats.balance)}
                  </div>
                  <p className="text-xs text-muted-foreground">Net for {format(selectedMonth, 'MMMM yyyy')}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Month selector and add transaction */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
                >
                  Previous
                </Button>
                <DatePicker
                  selected={selectedMonth}
                  onChange={(date) => setSelectedMonth(date || new Date())}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
                >
                  Next
                </Button>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitTransaction} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={transactionType === "income" ? "default" : "outline"}
                          onClick={() => setTransactionType("income")}
                          className="flex-1"
                        >
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Income
                        </Button>
                        <Button
                          type="button"
                          variant={transactionType === "expense" ? "default" : "outline"}
                          onClick={() => setTransactionType("expense")}
                          className="flex-1"
                        >
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Expense
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={transactionCategory}
                        onValueChange={setTransactionCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {customCategories[transactionType].map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Enter amount"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Input
                        id="description"
                        placeholder="Enter description"
                        value={transactionDescription}
                        onChange={(e) => setTransactionDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <DatePicker
                        selected={transactionDate}
                        onChange={(date) => setTransactionDate(date || new Date())}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Add Transaction</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {categoryData.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No expense data to display
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Budget Overview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Budget Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {budgetStatus.length > 0 ? (
                    <div className="space-y-4">
                      {budgetStatus.map((budget) => (
                        <div key={budget.category} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{budget.category}</span>
                            <span className={budget.isOverBudget ? 'text-red-500' : ''}>
                              {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${budget.isOverBudget ? 'bg-red-500' : 'bg-primary'}`} 
                              style={{ width: `${budget.percentage}%` }} 
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {budget.isOverBudget ? 
                                <span className="text-red-500 flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" /> 
                                  Over by {formatCurrency(Math.abs(budget.remaining))}
                                </span> : 
                                `${formatCurrency(budget.remaining)} remaining`
                              }
                            </span>
                            <span>{budget.percentage.toFixed(0)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                      <p className="mb-4">No budgets set up yet</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Create a Budget
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Budget</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmitBudget} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="budgetCategory">Category</Label>
                              <Select
                                value={budgetCategory}
                                onValueChange={setBudgetCategory}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {customCategories.expense.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="budgetLimit">Monthly Limit</Label>
                              <Input
                                id="budgetLimit"
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="Enter amount"
                                value={budgetLimit}
                                onChange={(e) => setBudgetLimit(e.target.value)}
                              />
                            </div>
                            
                            <Button type="submit" className="w-full">Set Budget</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Daily Expenses */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Daily Expenses</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {dailyExpenses.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyExpenses}>
                          <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
                          <YAxis 
                            tick={{ fill: '#ccc' }} 
                            tickFormatter={(value) => `$${value}`} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                            formatter={(value) => formatCurrency(Number(value))} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorAmount)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No expense data for this month
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Monthly Trends */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {monthlyTrends.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="month" tick={{ fill: '#ccc' }} />
                          <YAxis tick={{ fill: '#ccc' }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                            formatter={(value) => formatCurrency(Number(value))} 
                          />
                          <Legend />
                          <Bar dataKey="income" fill="#4ade80" name="Income" />
                          <Bar dataKey="expense" fill="#f43f5e" name="Expense" />
                          <Bar dataKey="savings" fill="#60a5fa" name="Savings" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No trend data available
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Transactions */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {filteredTransactions.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                      {filteredTransactions.slice(0, 10).map((transaction) => (
                        <div 
                          key={transaction.id} 
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              transaction.type === "income" ? "bg-green-900/30" : "bg-red-900/30"
                            }`}>
                              {transaction.type === "income" ? 
                                <ArrowUp className="h-4 w-4 text-green-500" /> : 
                                <ArrowDown className="h-4 w-4 text-red-500" />
                              }
                            </div>
                            <div>
                              <div className="font-medium">{transaction.category}</div>
                              <div className="text-xs text-muted-foreground">
                                {transaction.description || "No description"} - {format(new Date(transaction.date), 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                          <div className={`font-bold ${
                            transaction.type === "income" ? "text-green-500" : "text-red-500"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                      
                      {filteredTransactions.length > 10 && (
                        <div className="text-center pt-2">
                          <Button variant="link" size="sm" onClick={() => document.querySelector('[value="transactions"]')?.dispatchEvent(new Event('click'))}>
                            View All Transactions
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      No transactions for this period
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            {/* Transaction filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
                  <div className="flex flex-col md:flex-row gap-4 md:items-end">
                    {/* Type filter */}
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={filterType}
                        onValueChange={(value) => setFilterType(value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Category filter */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={filterCategory}
                        onValueChange={setFilterCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {customCategories.income.map((category) => (
                            <SelectItem key={`income-${category}`} value={category}>
                              {category} (Income)
                            </SelectItem>
                          ))}
                          {customCategories.expense.map((category) => (
                            <SelectItem key={`expense-${category}`} value={category}>
                              {category} (Expense)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Month filter */}
                    <div className="space-y-2">
                      <Label>Month</Label>
                      <DatePicker
                        selected={selectedMonth}
                        onChange={(date) => setSelectedMonth(date || new Date())}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={exportTransactions}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Transaction
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Transaction</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitTransaction} className="space-y-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <div className="flex space-x-2">
                              <Button
                                type="button"
                                variant={transactionType === "income" ? "default" : "outline"}
                                onClick={() => setTransactionType("income")}
                                className="flex-1"
                              >
                                <ArrowUp className="mr-2 h-4 w-4" />
                                Income
                              </Button>
                              <Button
                                type="button"
                                variant={transactionType === "expense" ? "default" : "outline"}
                                onClick={() => setTransactionType("expense")}
                                className="flex-1"
                              >
                                <ArrowDown className="mr-2 h-4 w-4" />
                                Expense
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={transactionCategory}
                              onValueChange={setTransactionCategory}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {customCategories[transactionType].map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Enter amount"
                              value={transactionAmount}
                              onChange={(e) => setTransactionAmount(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                              id="description"
                              placeholder="Enter description"
                              value={transactionDescription}
                              onChange={(e) => setTransactionDescription(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <DatePicker
                              selected={transactionDate}
                              onChange={(date) => setTransactionDate(date || new Date())}
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={15}
                              dateFormat="MMMM d, yyyy h:mm aa"
                            />
                          </div>
                          
                          <Button type="submit" className="w-full">Add Transaction</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Transactions list */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {filteredTransactions.length > 0 ? (
                    <>
                      <div className="grid grid-cols-12 gap-4 font-medium text-sm py-2 px-3 border-b">
                        <div className="col-span-4 md:col-span-3">Date & Time</div>
                        <div className="col-span-3 md:col-span-2">Type</div>
                        <div className="col-span-3 md:col-span-2">Category</div>
                        <div className="col-span-2 md:col-span-3 hidden md:block">Description</div>
                        <div className="col-span-2 text-right">Amount</div>
                      </div>
                      
                      {filteredTransactions.map((transaction) => (
                        <div 
                          key={transaction.id} 
                          className="grid grid-cols-12 gap-4 text-sm py-3 px-3 border-b border-border hover:bg-muted/20 rounded"
                        >
                          <div className="col-span-4 md:col-span-3">
                            <div>{format(new Date(transaction.date), 'MMM d, yyyy')}</div>
                            <div className="text-muted-foreground text-xs">{format(new Date(transaction.date), 'h:mm a')}</div>
                          </div>
                          <div className="col-span-3 md:col-span-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                              transaction.type === "income" ? "bg-green-900/30 text-green-500" : "bg-red-900/30 text-red-500"
                            }`}>
                              {transaction.type === "income" ? 
                                <ArrowUp className="mr-1 h-3 w-3" /> : 
                                <ArrowDown className="mr-1 h-3 w-3" />
                              }
                              {transaction.type === "income" ? "Income" : "Expense"}
                            </span>
                          </div>
                          <div className="col-span-3 md:col-span-2">{transaction.category}</div>
                          <div className="col-span-2 md:col-span-3 hidden md:block text-muted-foreground">
                            {transaction.description || "—"}
                          </div>
                          <div className={`col-span-2 text-right font-medium ${
                            transaction.type === "income" ? "text-green-500" : "text-red-500"
                          }`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="hidden md:flex items-center justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <p className="mb-4">No transactions found for the selected filters</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Transaction
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {/* Add transaction form (same as above) */}
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Set budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Set Monthly Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitBudget} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetCategory">Category</Label>
                      <Select
                        value={budgetCategory}
                        onValueChange={setBudgetCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {customCategories.expense.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budgetLimit">Monthly Limit</Label>
                      <Input
                        id="budgetLimit"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="Enter amount"
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit(e.target.value)}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">Set Budget</Button>
                  </form>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Add Custom Category</h3>
                    <form onSubmit={handleAddCategory} className="space-y-3">
                      <div className="flex gap-2">
                        <Select
                          value={categoryType}
                          onValueChange={(value) => setCategoryType(value as "income" | "expense")}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          placeholder="Category name"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                      </div>
                      <Button type="submit" variant="outline" size="sm" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
              
              {/* Budget overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Budgets</CardTitle>
                </CardHeader>
                <CardContent>
                  {budgets.length > 0 ? (
                    <div className="space-y-4">
                      {budgetStatus.map((budget) => (
                        <div key={budget.category} className="rounded-lg border border-border p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{budget.category}</h3>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteBudget(
                                budgets.find(b => b.category === budget.category)?.id || ""
                              )}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Budget Limit</span>
                              <span>{formatCurrency(budget.limit)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Spent</span>
                              <span className={budget.isOverBudget ? 'text-red-500' : ''}>
                                {formatCurrency(budget.spent)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                              <span>Remaining</span>
                              <span className={budget.remaining < 0 ? 'text-red-500' : 'text-green-500'}>
                                {formatCurrency(budget.remaining)}
                              </span>
                            </div>
                            
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${budget.isOverBudget ? 'bg-red-500' : 'bg-primary'}`} 
                                style={{ width: `${budget.percentage}%` }} 
                              />
                            </div>
                            <div className="text-xs text-right text-muted-foreground">
                              {budget.percentage.toFixed(0)}% used
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                      <p>No budgets set up yet. Create your first budget to start tracking expenses against limits.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income vs Expenses Trend */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Income vs Expenses Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {monthlyTrends.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyTrends}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="month" tick={{ fill: '#ccc' }} />
                          <YAxis tick={{ fill: '#ccc' }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                            formatter={(value) => formatCurrency(Number(value))} 
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="income" 
                            stroke="#4ade80" 
                            name="Income" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="expense" 
                            stroke="#f43f5e" 
                            name="Expense" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No data available for trend analysis
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Spending by Day of Week */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Spending by Day of Week</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {spendingPatterns.dayOfWeekChart.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendingPatterns.dayOfWeekChart}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                          <YAxis tick={{ fill: '#ccc' }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                            formatter={(value) => formatCurrency(Number(value))} 
                          />
                          <Bar dataKey="amount" fill="#9333ea" name="Amount Spent" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      Not enough data for analysis
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Spending by Time of Day */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Spending by Time of Day</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {spendingPatterns.timeOfDayChart.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={spendingPatterns.timeOfDayChart}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="amount"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {spendingPatterns.timeOfDayChart.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      Not enough data for analysis
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Savings Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Savings Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {monthlyTrends.length > 0 ? (
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyTrends}>
                          <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis dataKey="month" tick={{ fill: '#ccc' }} />
                          <YAxis tick={{ fill: '#ccc' }} tickFormatter={(value) => `$${value}`} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                            formatter={(value) => formatCurrency(Number(value))} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="savings" 
                            stroke="#60a5fa" 
                            fillOpacity={1}
                            fill="url(#colorSavings)" 
                            name="Savings"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      Not enough data for savings analysis
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default BudgetTracker;
