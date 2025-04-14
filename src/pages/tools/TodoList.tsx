
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { ListTodo, Plus, CheckCircle2, Circle, Trash2, Edit, ArrowUpDown, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  dueDate?: string;
};

const priorityColors = {
  low: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "dueDate">("createdAt");

  // Load from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
    };

    setTodos([...todos, newTodo]);
    setNewTodoText("");
    setDueDate("");
    toast.success("Task added successfully");
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Task deleted");
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
    toast.success("Task updated");
  };

  const updatePriority = (id: string, newPriority: "low" | "medium" | "high") => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority: newPriority } : todo
      )
    );
  };

  const updateDueDate = (id: string, newDueDate: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, dueDate: newDueDate } : todo
      )
    );
  };

  // Sort and filter todos
  const filteredAndSortedTodos = [...todos]
    .filter((todo) => {
      if (filter === "all") return true;
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

  // Count completed and remaining tasks
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <ToolLayout
      title="To-Do List"
      description="Manage tasks with priorities and deadlines"
      icon={<ListTodo className="h-6 w-6 text-primary" />}
    >
      <div className="max-w-4xl mx-auto">
        {/* Add new task form */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Add New Task</h3>
                <div className="flex gap-2">
                  <Input
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addTodo();
                    }}
                  />
                  <Button onClick={addTodo}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Priority</label>
                  <Select value={priority} onValueChange={(val) => setPriority(val as "low" | "medium" | "high")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm">Due Date (Optional)</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task listing */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <Tabs defaultValue="all" value={filter} onValueChange={(val) => setFilter(val as "all" | "active" | "completed")}>
                <TabsList>
                  <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
                  <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
                </TabsList>
              </Tabs>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by: {sortBy === "createdAt" ? "Date Created" : sortBy === "priority" ? "Priority" : "Due Date"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("createdAt")}>Date Created</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("priority")}>Priority</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("dueDate")}>Due Date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tasks */}
            <div className="space-y-3 mt-6">
              {filteredAndSortedTodos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <ListTodo className="h-12 w-12 mb-2 opacity-20" />
                  <p>No tasks found. Add one to get started!</p>
                </div>
              ) : (
                filteredAndSortedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-3 border rounded-md flex items-start gap-2 transition-colors ${
                      todo.completed ? "bg-muted/30" : "bg-card"
                    }`}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="mt-1"
                    />

                    <div className="flex-1 min-w-0">
                      {editingId === todo.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(todo.id);
                            }}
                          />
                          <Button size="sm" onClick={() => saveEdit(todo.id)}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p
                            className={`text-base ${
                              todo.completed ? "text-muted-foreground line-through" : ""
                            }`}
                          >
                            {todo.text}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline" className={priorityColors[todo.priority]}>
                              {todo.priority}
                            </Badge>
                            
                            {todo.dueDate && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(todo.dueDate), "MMM d, yyyy")}
                              </Badge>
                            )}
                            
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(todo.createdAt), "MMM d")}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(todo)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default TodoList;
