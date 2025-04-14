
import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | { from: Date; to?: Date } | undefined
  onSelect?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void
  disabled?: boolean
  className?: string
  // Extended props for compatibility with the DatePicker used in BudgetTracker
  onChange?: (date: Date | null) => void
  dateFormat?: string
  showMonthYearPicker?: boolean
  showTimeSelect?: boolean
  timeFormat?: string
  timeIntervals?: number
}

export function DatePicker({
  mode = "single",
  selected,
  onSelect,
  onChange,
  disabled = false,
  className,
  // Handle extended props or use sensible defaults
  dateFormat,
  showMonthYearPicker,
  showTimeSelect,
  timeFormat,
  timeIntervals
}: DatePickerProps) {
  
  // Handle the onChange event when used instead of onSelect
  const handleDateChange = (date: Date | Date[] | { from: Date; to?: Date } | undefined) => {
    if (onSelect) {
      onSelect(date);
    }
    
    // Also call onChange if it exists (for backward compatibility)
    if (onChange) {
      if (date instanceof Date) {
        onChange(date);
      } else if (Array.isArray(date) && date.length > 0) {
        onChange(date[0]);
      } else if (date && 'from' in date) {
        onChange(date.from);
      } else {
        onChange(null);
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {mode === "single" && (
        <Calendar
          mode="single"
          selected={selected as Date | undefined}
          onSelect={handleDateChange as (date: Date | undefined) => void}
          disabled={disabled}
          initialFocus
        />
      )}
      {mode === "range" && (
        <Calendar
          mode="range"
          selected={selected as { from: Date; to?: Date } | undefined}
          onSelect={handleDateChange as (date: { from: Date; to?: Date } | undefined) => void}
          disabled={disabled}
          initialFocus
        />
      )}
      {mode === "multiple" && (
        <Calendar
          mode="multiple"
          selected={selected as Date[] | undefined}
          onSelect={handleDateChange as (date: Date[] | undefined) => void}
          disabled={disabled}
          initialFocus
        />
      )}
    </div>
  )
}

export function DatePickerWithButton({
  mode = "single",
  selected,
  onSelect,
  onChange,
  disabled = false,
  className
}: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  
  const handleDateChange = (date: Date | Date[] | { from: Date; to?: Date } | undefined) => {
    if (onSelect) {
      onSelect(date);
    }
    
    if (onChange) {
      if (date instanceof Date) {
        onChange(date);
      } else if (Array.isArray(date) && date.length > 0) {
        onChange(date[0]);
      } else if (date && 'from' in date) {
        onChange(date.from);
      } else {
        onChange(null);
      }
    }
    
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected instanceof Date ? (
            format(selected, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DatePicker
          mode={mode}
          selected={selected}
          onSelect={handleDateChange}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
