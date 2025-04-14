import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Sliders, Calendar, DollarSign, PieChartIcon, BarChart4, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface LoanDetails {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  paymentFrequency: "monthly" | "biweekly" | "weekly";
}

interface AmortizationEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanCalculator = () => {
  const { toast } = useToast();
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    loanAmount: 100000,
    interestRate: 5.5,
    loanTerm: 30,
    paymentFrequency: "monthly"
  });
  const [amortizationSchedule, setAmortizationSchedule] = useState<AmortizationEntry[]>([]);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    calculateLoan();
  }, [loanDetails]);

  const handleInputChange = (field: keyof LoanDetails, value: string | number) => {
    let parsedValue: string | number = value;
    
    if (field === 'loanAmount' || field === 'interestRate' || field === 'loanTerm') {
      parsedValue = parseFloat(value as string) || 0;
    }
    
    setLoanDetails({
      ...loanDetails,
      [field]: parsedValue
    });
  };

  const getNumberOfPayments = (): number => {
    const yearsToMonths = loanDetails.loanTerm * 12;
    
    switch (loanDetails.paymentFrequency) {
      case "biweekly":
        return yearsToMonths * (26 / 12);
      case "weekly":
        return yearsToMonths * (52 / 12);
      case "monthly":
      default:
        return yearsToMonths;
    }
  };

  const getPeriodicInterestRate = (): number => {
    const annualRate = loanDetails.interestRate / 100;
    
    switch (loanDetails.paymentFrequency) {
      case "biweekly":
        return annualRate / 26;
      case "weekly":
        return annualRate / 52;
      case "monthly":
      default:
        return annualRate / 12;
    }
  };

  const calculateLoan = () => {
    const principal = loanDetails.loanAmount;
    const periodicInterestRate = getPeriodicInterestRate();
    const numberOfPayments = getNumberOfPayments();
    
    if (principal <= 0 || loanDetails.interestRate <= 0 || numberOfPayments <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalCost(0);
      setAmortizationSchedule([]);
      setChartData([]);
      return;
    }
    
    const payment = principal * (
      periodicInterestRate * Math.pow(1 + periodicInterestRate, numberOfPayments)
    ) / (
      Math.pow(1 + periodicInterestRate, numberOfPayments) - 1
    );
    
    let balance = principal;
    const schedule: AmortizationEntry[] = [];
    let totalInterestPaid = 0;
    
    for (let period = 1; period <= numberOfPayments; period++) {
      const interestPaid = balance * periodicInterestRate;
      const principalPaid = payment - interestPaid;
      balance -= principalPaid;
      
      totalInterestPaid += interestPaid;
      
      schedule.push({
        period,
        payment,
        principal: principalPaid,
        interest: interestPaid,
        balance: Math.max(0, balance)
      });
    }
    
    setMonthlyPayment(payment);
    setTotalInterest(totalInterestPaid);
    setTotalCost(principal + totalInterestPaid);
    setAmortizationSchedule(schedule);
    
    setChartData([
      { name: "Principal", value: principal },
      { name: "Interest", value: totalInterestPaid }
    ]);
  };

  const generateYearlySummary = () => {
    const yearlySummary: { year: number; principal: number; interest: number }[] = [];
    
    if (amortizationSchedule.length === 0) return [];
    
    const paymentsPerYear = loanDetails.paymentFrequency === "monthly" 
      ? 12 
      : loanDetails.paymentFrequency === "biweekly" 
        ? 26 
        : 52;
    
    for (let year = 1; year <= Math.ceil(loanDetails.loanTerm); year++) {
      const startIdx = (year - 1) * paymentsPerYear;
      const endIdx = Math.min(year * paymentsPerYear, amortizationSchedule.length);
      
      if (startIdx >= amortizationSchedule.length) break;
      
      const yearData = amortizationSchedule.slice(startIdx, endIdx);
      const principalPaid = yearData.reduce((sum, entry) => sum + entry.principal, 0);
      const interestPaid = yearData.reduce((sum, entry) => sum + entry.interest, 0);
      
      yearlySummary.push({
        year,
        principal: principalPaid,
        interest: interestPaid
      });
    }
    
    return yearlySummary;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const downloadAmortizationSchedule = () => {
    if (amortizationSchedule.length === 0) {
      toast({
        title: "No data to download",
        description: "Please calculate loan details first",
        variant: "destructive"
      });
      return;
    }
    
    let csvContent = "Period,Payment,Principal,Interest,Remaining Balance\n";
    
    amortizationSchedule.forEach(entry => {
      csvContent += `${entry.period},${entry.payment.toFixed(2)},${entry.principal.toFixed(2)},${entry.interest.toFixed(2)},${entry.balance.toFixed(2)}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'amortization_schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Amortization schedule is being downloaded"
    });
  };

  const getPaymentFrequencyLabel = (): string => {
    switch (loanDetails.paymentFrequency) {
      case "biweekly":
        return "Biweekly";
      case "weekly":
        return "Weekly";
      case "monthly":
      default:
        return "Monthly";
    }
  };

  const COLORS = ['#8B5CF6', '#EC4899'];

  return (
    <ToolLayout
      title="Loan Calculator"
      description="Calculate loan payments and interest"
      icon={<Sliders className="h-6 w-6 text-primary" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="loanAmount"
                    type="number"
                    className="pl-8"
                    value={loanDetails.loanAmount}
                    onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                    min="1000"
                    step="1000"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={loanDetails.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="loanTerm"
                    type="number"
                    className="pl-8"
                    value={loanDetails.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    min="1"
                    max="50"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                <select
                  id="paymentFrequency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1"
                  value={loanDetails.paymentFrequency}
                  onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <Button onClick={calculateLoan} className="w-full">
                Calculate
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{getPaymentFrequencyLabel()} Payment</span>
                <span className="font-medium text-lg">{formatCurrency(monthlyPayment)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Principal</span>
                <span className="font-medium">{formatCurrency(loanDetails.loanAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-medium text-rose-500">{formatCurrency(totalInterest)}</span>
              </div>
              
              <div className="border-t border-border pt-2 flex justify-between items-center">
                <span className="font-medium">Total Cost</span>
                <span className="font-medium text-lg">{formatCurrency(totalCost)}</span>
              </div>
              
              {totalCost > 0 && (
                <div className="py-2">
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${(loanDetails.loanAmount / totalCost * 100).toFixed(2)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Principal: {((loanDetails.loanAmount / totalCost) * 100).toFixed(1)}%</span>
                    <span>Interest: {((totalInterest / totalCost) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={downloadAmortizationSchedule}
                disabled={amortizationSchedule.length === 0}
              >
                <Download className="h-4 w-4 mr-2" /> Download Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" /> Principal vs Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5" /> Yearly Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={generateYearlySummary()}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value as number)}
                          labelFormatter={(value) => `Year ${value}`}
                        />
                        <Legend />
                        <Bar dataKey="principal" name="Principal" fill="#8B5CF6" />
                        <Bar dataKey="interest" name="Interest" fill="#EC4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Amortization Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {amortizationSchedule.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enter loan details and click "Calculate" to see the amortization schedule</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium">Period</th>
                        <th className="text-right py-2 font-medium">Payment</th>
                        <th className="text-right py-2 font-medium">Principal</th>
                        <th className="text-right py-2 font-medium">Interest</th>
                        <th className="text-right py-2 font-medium">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {amortizationSchedule.slice(0, 12).map((entry) => (
                        <tr key={entry.period} className="border-b border-border/50 hover:bg-muted/10">
                          <td className="py-2">{entry.period}</td>
                          <td className="text-right py-2">{formatCurrency(entry.payment)}</td>
                          <td className="text-right py-2">{formatCurrency(entry.principal)}</td>
                          <td className="text-right py-2">{formatCurrency(entry.interest)}</td>
                          <td className="text-right py-2">{formatCurrency(entry.balance)}</td>
                        </tr>
                      ))}
                      
                      {amortizationSchedule.length > 12 && (
                        <>
                          <tr className="border-b border-border/50 bg-muted/5">
                            <td colSpan={5} className="py-2 text-center text-muted-foreground">
                              ... showing 12 of {amortizationSchedule.length} periods
                            </td>
                          </tr>
                          <tr className="border-b border-border/50 hover:bg-muted/10">
                            <td className="py-2">{amortizationSchedule.length}</td>
                            <td className="text-right py-2">
                              {formatCurrency(amortizationSchedule[amortizationSchedule.length - 1].payment)}
                            </td>
                            <td className="text-right py-2">
                              {formatCurrency(amortizationSchedule[amortizationSchedule.length - 1].principal)}
                            </td>
                            <td className="text-right py-2">
                              {formatCurrency(amortizationSchedule[amortizationSchedule.length - 1].interest)}
                            </td>
                            <td className="text-right py-2">
                              {formatCurrency(amortizationSchedule[amortizationSchedule.length - 1].balance)}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-muted/20 rounded-lg">
        <h3 className="font-medium mb-2">About Loan Calculations</h3>
        <p className="text-sm text-muted-foreground mb-2">
          This calculator uses the standard amortization formula to determine your loan payments.
          The payment amount remains constant throughout the loan term, but the portion going to principal increases over time while the interest portion decreases.
        </p>
        <p className="text-sm text-muted-foreground">
          Remember that this calculator provides estimates and actual loan terms may vary based on lender policies, fees, and other factors.
        </p>
      </div>
    </ToolLayout>
  );
};

export default LoanCalculator;
