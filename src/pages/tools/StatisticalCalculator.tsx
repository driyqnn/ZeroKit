import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import {
  BarChart3,
  BarChart,
  Calculator,
  ChevronDown,
  Upload,
  Download,
  Copy,
  RefreshCw,
  Percent,
  FunctionSquare,
  ChevronRight,
  PlusCircle,
  XCircle,
  Trash,
  CircleCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DataSet {
  name: string;
  values: number[];
  color: string;
}

interface StatisticalResults {
  mean: number;
  median: number;
  mode: string;
  range: number;
  variance: number;
  standardDeviation: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  interquartileRange: number;
  min: number;
  max: number;
  sum: number;
  count: number;
  skewness: number;
  kurtosis: number;
  coefficientOfVariation: number;
  frequencyDistribution: {
    value: number | string;
    frequency: number;
  }[];
}

interface ZTestResults {
  zScore: number;
  pValue: number;
  significance: boolean;
  confidenceInterval: number[];
}

interface TTestResults {
  tScore: number;
  pValue: number;
  significance: boolean;
  confidenceInterval: number[];
  degreesOfFreedom: number;
}

// Helper functions for statistical calculations
const calculateMean = (data: number[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, value) => sum + value, 0) / data.length;
};

const calculateMedian = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sortedData = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sortedData.length / 2);
  return sortedData.length % 2 === 0
    ? (sortedData[mid - 1] + sortedData[mid]) / 2
    : sortedData[mid];
};

const calculateMode = (data: number[]): number[] => {
  if (data.length === 0) return [];

  const frequency: Record<number, number> = {};
  data.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
  });

  let maxFrequency = 0;
  let modes: number[] = [];

  for (const value in frequency) {
    const freq = frequency[value];
    if (freq > maxFrequency) {
      maxFrequency = freq;
      modes = [Number(value)];
    } else if (freq === maxFrequency) {
      modes.push(Number(value));
    }
  }

  return modes;
};

const calculateVariance = (data: number[], isSample = true): number => {
  if (data.length <= 1) return 0;
  const mean = calculateMean(data);
  const squaredDiffs = data.map((value) => Math.pow(value - mean, 2));
  const sumOfSquaredDiffs = squaredDiffs.reduce((sum, value) => sum + value, 0);
  return isSample
    ? sumOfSquaredDiffs / (data.length - 1)
    : sumOfSquaredDiffs / data.length;
};

const calculateStandardDeviation = (
  data: number[],
  isSample = true
): number => {
  return Math.sqrt(calculateVariance(data, isSample));
};

const calculateQuartiles = (
  data: number[]
): { q1: number; q2: number; q3: number } => {
  if (data.length === 0) return { q1: 0, q2: 0, q3: 0 };

  const sortedData = [...data].sort((a, b) => a - b);
  const q2 = calculateMedian(sortedData);

  const lowerHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
  const upperHalf = sortedData.slice(Math.ceil(sortedData.length / 2));

  const q1 = calculateMedian(lowerHalf);
  const q3 = calculateMedian(upperHalf);

  return { q1, q2, q3 };
};

const calculateSkewness = (data: number[]): number => {
  if (data.length < 3) return 0;

  const mean = calculateMean(data);
  const std = calculateStandardDeviation(data, false);
  if (std === 0) return 0;

  const n = data.length;
  const sum = data.reduce((acc, value) => acc + Math.pow(value - mean, 3), 0);
  return sum / n / Math.pow(std, 3);
};

const calculateKurtosis = (data: number[]): number => {
  if (data.length < 4) return 0;

  const mean = calculateMean(data);
  const std = calculateStandardDeviation(data, false);
  if (std === 0) return 0;

  const n = data.length;
  const sum = data.reduce((acc, value) => acc + Math.pow(value - mean, 4), 0);
  return sum / n / Math.pow(std, 4) - 3; // Subtracting 3 to get excess kurtosis
};

const calculateZScore = (
  mean: number,
  populationMean: number,
  stdDev: number,
  n: number
): number => {
  return (mean - populationMean) / (stdDev / Math.sqrt(n));
};

// Calculate p-value from z-score
const calculatePValue = (zScore: number): number => {
  // This is an approximation of the standard normal CDF
  const absZ = Math.abs(zScore);
  const p =
    1 -
    (1 / Math.sqrt(2 * Math.PI)) *
      Math.exp(-Math.pow(absZ, 2) / 2) *
      (0.4361836 * absZ -
        0.1201676 * Math.pow(absZ, 2) +
        0.937298 * Math.pow(absZ, 3));
  return zScore < 0 ? 1 - p : p;
};

// Calculate t-score
const calculateTScore = (
  mean: number,
  populationMean: number,
  stdDev: number,
  n: number
): number => {
  return (mean - populationMean) / (stdDev / Math.sqrt(n));
};

// Random colors for datasets
const getRandomColor = (): string => {
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#7BC043",
    "#F37736",
    "#EE4035",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const StatisticalCalculator = () => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [inputText, setInputText] = useState<string>("");
  const [datasets, setDatasets] = useState<DataSet[]>([
    { name: "Dataset 1", values: [], color: getRandomColor() },
  ]);
  const [activeDataset, setActiveDataset] = useState<number>(0);
  const [results, setResults] = useState<StatisticalResults | null>(null);
  const [zTestResults, setZTestResults] = useState<ZTestResults | null>(null);
  const [tTestResults, setTTestResults] = useState<TTestResults | null>(null);

  // Hypothesis testing parameters
  const [populationMean, setPopulationMean] = useState<string>("0");
  const [significanceLevel, setSignificanceLevel] = useState<string>("0.05");
  const [confidenceLevel, setConfidenceLevel] = useState<string>("95");

  // Parse input text into numbers
  const parseInput = () => {
    const values = inputText
      .split(/[,\s\n]+/)
      .map((value) => value.trim())
      .filter((value) => value !== "")
      .map((value) => parseFloat(value));

    if (values.some(isNaN)) {
      toast.error(
        "Invalid input. Please enter numeric values separated by commas or spaces."
      );
      return;
    }

    const updatedDatasets = [...datasets];
    updatedDatasets[activeDataset].values = values;
    setDatasets(updatedDatasets);

    // Calculate statistics for the current dataset
    calculateStatistics(values);

    toast.success(
      `Updated Dataset ${activeDataset + 1} with ${values.length} values`
    );
  };

  // Calculate statistical measures
  const calculateStatistics = (data: number[]) => {
    if (data.length === 0) {
      setResults(null);
      return;
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const mean = calculateMean(data);
    const median = calculateMedian(data);
    const modeArray = calculateMode(data);
    const mode = modeArray.length === 0 ? "No mode" : modeArray.join(", ");
    const variance = calculateVariance(data);
    const standardDeviation = calculateStandardDeviation(data);
    const quartiles = calculateQuartiles(data);
    const interquartileRange = quartiles.q3 - quartiles.q1;
    const skewness = calculateSkewness(data);
    const kurtosis = calculateKurtosis(data);
    const coefficientOfVariation = (standardDeviation / mean) * 100;

    // Calculate frequency distribution
    const frequency: Record<number, number> = {};
    data.forEach((value) => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    const frequencyDistribution = Object.entries(frequency)
      .map(([value, freq]) => ({ value: parseFloat(value), frequency: freq }))
      .sort((a, b) => (a.value as number) - (b.value as number));

    setResults({
      mean,
      median,
      mode,
      range: Math.max(...data) - Math.min(...data),
      variance,
      standardDeviation,
      quartiles,
      interquartileRange,
      min: Math.min(...data),
      max: Math.max(...data),
      sum: data.reduce((sum, value) => sum + value, 0),
      count: data.length,
      skewness,
      kurtosis,
      coefficientOfVariation,
      frequencyDistribution,
    });

    // Run Z-test if enough data is available
    if (data.length >= 30) {
      runZTest(mean, standardDeviation, data.length);
    } else if (data.length > 1) {
      runTTest(mean, standardDeviation, data.length);
    }
  };

  // Run Z-test for hypothesis testing
  const runZTest = (mean: number, stdDev: number, n: number) => {
    const popMean = parseFloat(populationMean);
    const alpha = parseFloat(significanceLevel);
    const confLevel = parseFloat(confidenceLevel) / 100;

    const zScore = calculateZScore(mean, popMean, stdDev, n);
    const pValue = calculatePValue(zScore);
    const significance = pValue < alpha;

    // Calculate confidence interval
    const zCritical = 1.96; // Approximation for 95% confidence
    const marginOfError = zCritical * (stdDev / Math.sqrt(n));
    const confidenceInterval = [mean - marginOfError, mean + marginOfError];

    setZTestResults({
      zScore,
      pValue,
      significance,
      confidenceInterval,
    });
  };

  // Run T-test for hypothesis testing
  const runTTest = (mean: number, stdDev: number, n: number) => {
    const popMean = parseFloat(populationMean);
    const alpha = parseFloat(significanceLevel);
    const dof = n - 1; // Degrees of freedom

    const tScore = calculateTScore(mean, popMean, stdDev, n);
    // Simple approximation of p-value for t-distribution
    const pValue = calculatePValue(tScore); // This is an approximation
    const significance = pValue < alpha;

    // Calculate confidence interval
    const tCritical = 2.0; // Approximation for 95% confidence
    const marginOfError = tCritical * (stdDev / Math.sqrt(n));
    const confidenceInterval = [mean - marginOfError, mean + marginOfError];

    setTTestResults({
      tScore,
      pValue,
      significance,
      confidenceInterval,
      degreesOfFreedom: dof,
    });
  };

  // Add a new dataset
  const addDataset = () => {
    const newDataset: DataSet = {
      name: `Dataset ${datasets.length + 1}`,
      values: [],
      color: getRandomColor(),
    };
    setDatasets([...datasets, newDataset]);
    setActiveDataset(datasets.length);
    setInputText("");
    setResults(null);
  };

  // Remove the current dataset
  const removeDataset = () => {
    if (datasets.length <= 1) {
      toast.error("Cannot remove the only dataset");
      return;
    }

    const updatedDatasets = datasets.filter(
      (_, index) => index !== activeDataset
    );
    setDatasets(updatedDatasets);
    setActiveDataset(Math.min(activeDataset, updatedDatasets.length - 1));

    // Update the input and results based on the new active dataset
    if (updatedDatasets.length > 0) {
      setInputText(
        updatedDatasets[
          Math.min(activeDataset, updatedDatasets.length - 1)
        ].values.join(", ")
      );
      calculateStatistics(
        updatedDatasets[Math.min(activeDataset, updatedDatasets.length - 1)]
          .values
      );
    } else {
      setInputText("");
      setResults(null);
    }
  };

  // Switch between datasets
  const switchDataset = (index: number) => {
    setActiveDataset(index);
    setInputText(datasets[index].values.join(", "));
    calculateStatistics(datasets[index].values);
  };

  // Clear the current dataset
  const clearDataset = () => {
    const updatedDatasets = [...datasets];
    updatedDatasets[activeDataset].values = [];
    setDatasets(updatedDatasets);
    setInputText("");
    setResults(null);

    toast.success(`Cleared Dataset ${activeDataset + 1}`);
  };

  // Import data from a CSV file
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n");
      const values: number[] = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === "") continue;

        const parsedValues = trimmedLine
          .split(/[,\t;]/)
          .map((value) => parseFloat(value.trim()))
          .filter((value) => !isNaN(value));

        values.push(...parsedValues);
      }

      if (values.length === 0) {
        toast.error("No valid numeric data found in the file.");
        return;
      }

      const updatedDatasets = [...datasets];
      updatedDatasets[activeDataset].values = values;
      setDatasets(updatedDatasets);
      setInputText(values.join(", "));
      calculateStatistics(values);

      toast.success(`Imported ${values.length} values from CSV file`);
    };

    reader.readAsText(file);

    // Reset the input to allow selecting the same file again
    event.target.value = "";
  };

  // Export the current dataset to a CSV file
  const exportToCSV = () => {
    const values = datasets[activeDataset].values;
    if (values.length === 0) {
      toast.error("No data to export");
      return;
    }

    const csvContent = values.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `dataset_ZeroKit${activeDataset + 1}.csv`;
    link.click();

    URL.revokeObjectURL(url);

    toast.success("Dataset exported to CSV");
  };

  // Copy results to clipboard
  const copyResults = () => {
    if (!results) return;

    let resultsText = "Statistical Analysis Results\n\n";
    resultsText += `Mean: ${results.mean.toFixed(4)}\n`;
    resultsText += `Median: ${results.median.toFixed(4)}\n`;
    resultsText += `Mode: ${results.mode}\n`;
    resultsText += `Range: ${results.range.toFixed(4)}\n`;
    resultsText += `Variance: ${results.variance.toFixed(4)}\n`;
    resultsText += `Standard Deviation: ${results.standardDeviation.toFixed(
      4
    )}\n`;
    resultsText += `Quartiles: Q1=${results.quartiles.q1.toFixed(
      4
    )}, Q2=${results.quartiles.q2.toFixed(
      4
    )}, Q3=${results.quartiles.q3.toFixed(4)}\n`;
    resultsText += `Interquartile Range: ${results.interquartileRange.toFixed(
      4
    )}\n`;
    resultsText += `Min: ${results.min.toFixed(4)}\n`;
    resultsText += `Max: ${results.max.toFixed(4)}\n`;
    resultsText += `Sum: ${results.sum.toFixed(4)}\n`;
    resultsText += `Count: ${results.count}\n`;
    resultsText += `Skewness: ${results.skewness.toFixed(4)}\n`;
    resultsText += `Kurtosis: ${results.kurtosis.toFixed(4)}\n`;
    resultsText += `Coefficient of Variation: ${results.coefficientOfVariation.toFixed(
      4
    )}%\n`;

    navigator.clipboard.writeText(resultsText);
    toast.success("Results copied to clipboard");
  };

  // Generate chart data for visualization
  const generateFrequencyChartData = () => {
    if (!results || !results.frequencyDistribution.length) return [];

    return results.frequencyDistribution.map((item) => ({
      name: item.value.toString(),
      value: item.frequency,
      fill: datasets[activeDataset].color,
    }));
  };

  // Generate box plot data for visualization
  const generateBoxPlotData = () => {
    if (!results) return [];

    return [
      {
        name: datasets[activeDataset].name,
        min: results.min,
        q1: results.quartiles.q1,
        median: results.median,
        q3: results.quartiles.q3,
        max: results.max,
        fill: datasets[activeDataset].color,
      },
    ];
  };

  // Generate comparative chart data for visualization
  const generateComparisonChartData = () => {
    return datasets.map((dataset) => ({
      name: dataset.name,
      mean: calculateMean(dataset.values) || 0,
      median: calculateMedian(dataset.values) || 0,
      stdDev: calculateStandardDeviation(dataset.values) || 0,
      fill: dataset.color,
    }));
  };

  // Update input text when switching datasets
  useEffect(() => {
    if (datasets[activeDataset]) {
      setInputText(datasets[activeDataset].values.join(", "));
    }
  }, [activeDataset, datasets]);

  return (
    <ToolLayout
      title="Statistical Calculator"
      description="Calculate descriptive statistics, run hypothesis tests, and visualize your data"
      icon={<BarChart3 className="h-6 w-6 text-indigo-500" />}>
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="basic" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="basic">Basic Statistics</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
            <TabsTrigger value="hypothesis">Hypothesis Testing</TabsTrigger>
            <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-indigo-500" />
                      Data Input
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={clearDataset}>
                        <Trash className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                      <label htmlFor="csv-import">
                        <Button variant="ghost" size="sm" asChild>
                          <div>
                            <Upload className="h-4 w-4 mr-1" />
                            Import
                          </div>
                        </Button>
                      </label>
                      <input
                        id="csv-import"
                        type="file"
                        accept=".csv,.txt"
                        onChange={importFromCSV}
                        className="hidden"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={exportToCSV}
                        disabled={!datasets[activeDataset]?.values.length}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Enter numeric values separated by commas, spaces, or new
                    lines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {datasets.map((dataset, index) => (
                        <Button
                          key={index}
                          variant={
                            activeDataset === index ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => switchDataset(index)}
                          style={{
                            backgroundColor:
                              activeDataset === index
                                ? dataset.color
                                : undefined,
                          }}>
                          {dataset.name}{" "}
                          {dataset.values.length > 0 &&
                            `(${dataset.values.length})`}
                        </Button>
                      ))}
                      <Button variant="outline" size="sm" onClick={addDataset}>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      {datasets.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={removeDataset}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <textarea
                      className="w-full h-40 p-3 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-background"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter numeric values here (e.g. 1, 2, 3, 4, 5)"
                    />

                    <Button
                      className="w-full"
                      onClick={parseInput}
                      disabled={!inputText.trim()}>
                      Calculate Statistics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <TabsContent value="basic" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Basic Statistics</CardTitle>
                      {results && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyResults}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!results ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Enter data and calculate statistics to view results
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Mean
                          </div>
                          <div className="font-medium text-xl">
                            {results.mean.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Median
                          </div>
                          <div className="font-medium text-xl">
                            {results.median.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Mode
                          </div>
                          <div className="font-medium text-xl">
                            {results.mode}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Range
                          </div>
                          <div className="font-medium text-xl">
                            {results.range.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Standard Deviation
                          </div>
                          <div className="font-medium text-xl">
                            {results.standardDeviation.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Variance
                          </div>
                          <div className="font-medium text-xl">
                            {results.variance.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Minimum
                          </div>
                          <div className="font-medium text-xl">
                            {results.min.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Maximum
                          </div>
                          <div className="font-medium text-xl">
                            {results.max.toFixed(4)}
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <div className="text-sm text-muted-foreground">
                            Count
                          </div>
                          <div className="font-medium text-xl">
                            {results.count}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!results ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Enter data and calculate statistics to view advanced
                        results
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Sum
                            </div>
                            <div className="font-medium text-xl">
                              {results.sum.toFixed(4)}
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Coefficient of Variation
                            </div>
                            <div className="font-medium text-xl">
                              {results.coefficientOfVariation.toFixed(2)}%
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Skewness
                            </div>
                            <div className="font-medium text-xl">
                              {results.skewness.toFixed(4)}
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Kurtosis
                            </div>
                            <div className="font-medium text-xl">
                              {results.kurtosis.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Quartiles
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                First Quartile (Q1)
                              </div>
                              <div className="font-medium text-xl">
                                {results.quartiles.q1.toFixed(4)}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Second Quartile (Q2)
                              </div>
                              <div className="font-medium text-xl">
                                {results.quartiles.q2.toFixed(4)}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Third Quartile (Q3)
                              </div>
                              <div className="font-medium text-xl">
                                {results.quartiles.q3.toFixed(4)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-muted/30 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Interquartile Range (IQR)
                            </div>
                            <div className="font-medium text-xl">
                              {results.interquartileRange.toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Frequency Distribution
                          </h3>
                          {results.frequencyDistribution.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-muted">
                                    <th className="p-2 text-left">Value</th>
                                    <th className="p-2 text-left">Frequency</th>
                                    <th className="p-2 text-left">
                                      Rel. Frequency (%)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {results.frequencyDistribution.map(
                                    (item, index) => (
                                      <tr
                                        key={index}
                                        className="border-t border-muted">
                                        <td className="p-2">{item.value}</td>
                                        <td className="p-2">
                                          {item.frequency}
                                        </td>
                                        <td className="p-2">
                                          {(
                                            (item.frequency / results.count) *
                                            100
                                          ).toFixed(2)}
                                          %
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No frequency distribution available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hypothesis" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hypothesis Testing</CardTitle>
                    <CardDescription>
                      Test hypotheses about your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="populationMean">
                            Population Mean (μ₀)
                          </Label>
                          <Input
                            id="populationMean"
                            type="number"
                            value={populationMean}
                            onChange={(e) => setPopulationMean(e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="significanceLevel">
                            Significance Level (α)
                          </Label>
                          <Input
                            id="significanceLevel"
                            type="number"
                            min="0.01"
                            max="0.1"
                            step="0.01"
                            value={significanceLevel}
                            onChange={(e) =>
                              setSignificanceLevel(e.target.value)
                            }
                            placeholder="0.05"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confidenceLevel">
                            Confidence Level (%)
                          </Label>
                          <Input
                            id="confidenceLevel"
                            type="number"
                            min="80"
                            max="99"
                            step="1"
                            value={confidenceLevel}
                            onChange={(e) => setConfidenceLevel(e.target.value)}
                            placeholder="95"
                          />
                        </div>
                      </div>

                      {/* Add hypothesis testing results here */}
                      {zTestResults && (
                        <div className="space-y-4 mt-4">
                          <h3 className="text-lg font-medium">
                            Z-Test Results
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Z-Score
                              </div>
                              <div className="font-medium text-xl">
                                {zTestResults.zScore.toFixed(4)}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                P-Value
                              </div>
                              <div className="font-medium text-xl">
                                {zTestResults.pValue.toFixed(4)}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Significance
                              </div>
                              <div className="font-medium text-xl flex items-center">
                                {zTestResults.significance ? (
                                  <>
                                    <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                                    Significant
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                    Not Significant
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Confidence Interval
                              </div>
                              <div className="font-medium text-xl">
                                [{zTestResults.confidenceInterval[0].toFixed(2)}
                                ,{" "}
                                {zTestResults.confidenceInterval[1].toFixed(2)}]
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {tTestResults && !zTestResults && (
                        <div className="space-y-4 mt-4">
                          <h3 className="text-lg font-medium">
                            T-Test Results
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                T-Score
                              </div>
                              <div className="font-medium text-xl">
                                {tTestResults.tScore.toFixed(4)}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                P-Value
                              </div>
                              <div className="font-medium text-xl">
                                {tTestResults.pValue.toFixed(4)}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Significance
                              </div>
                              <div className="font-medium text-xl flex items-center">
                                {tTestResults.significance ? (
                                  <>
                                    <CircleCheck className="h-5 w-5 text-green-500 mr-2" />
                                    Significant
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                    Not Significant
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-md">
                              <div className="text-sm text-muted-foreground">
                                Confidence Interval
                              </div>
                              <div className="font-medium text-xl">
                                [{tTestResults.confidenceInterval[0].toFixed(2)}
                                ,{" "}
                                {tTestResults.confidenceInterval[1].toFixed(2)}]
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visualization" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!results ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Enter data and calculate statistics to view
                        visualizations
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-3">
                            Frequency Distribution
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartBar
                                data={generateFrequencyChartData()}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 5,
                                }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar
                                  dataKey="value"
                                  name="Frequency"
                                  fill={datasets[activeDataset].color}
                                />
                              </RechartBar>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <Separator />

                        {datasets.length > 1 && (
                          <div>
                            <h3 className="text-lg font-medium mb-3">
                              Comparison Between Datasets
                            </h3>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartBar
                                  data={generateComparisonChartData()}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <RechartsTooltip />
                                  <Legend />
                                  <Bar
                                    dataKey="mean"
                                    name="Mean"
                                    fill="#8884d8"
                                  />
                                  <Bar
                                    dataKey="median"
                                    name="Median"
                                    fill="#82ca9d"
                                  />
                                  <Bar
                                    dataKey="stdDev"
                                    name="Std Dev"
                                    fill="#ffc658"
                                  />
                                </RechartBar>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div>
                          <h3 className="text-lg font-medium mb-3">Box Plot</h3>
                          <div className="p-4 bg-muted/30 rounded-md">
                            <div className="flex items-center justify-center space-x-8">
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
                                <span>Min: {results.min.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                                <span>
                                  Q1: {results.quartiles.q1.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                                <span>Median: {results.median.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                                <span>
                                  Q3: {results.quartiles.q3.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 bg-muted-foreground rounded-sm"></div>
                                <span>Max: {results.max.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="mt-4 relative h-16">
                              <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted-foreground transform -translate-y-1/2"></div>
                              <div
                                className="absolute top-1/2 h-1 bg-blue-500 transform -translate-y-1/2"
                                style={{
                                  left: `${
                                    ((results.quartiles.q1 - results.min) /
                                      (results.max - results.min)) *
                                    100
                                  }%`,
                                  right: `${
                                    100 -
                                    ((results.quartiles.q3 - results.min) /
                                      (results.max - results.min)) *
                                      100
                                  }%`,
                                }}></div>
                              <div
                                className="absolute top-1/2 w-2 h-8 bg-blue-600 transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  left: `${
                                    ((results.median - results.min) /
                                      (results.max - results.min)) *
                                    100
                                  }%`,
                                }}></div>
                              <div
                                className="absolute top-1/2 w-2 h-4 bg-muted-foreground transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  left: "0%",
                                }}></div>
                              <div
                                className="absolute top-1/2 w-2 h-4 bg-muted-foreground transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  left: "100%",
                                }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {!results ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Enter data to view summary statistics
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-sm text-muted-foreground">
                          Dataset
                        </div>
                        <div className="font-medium">
                          {datasets[activeDataset].name}
                        </div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-sm text-muted-foreground">
                          Sample Size
                        </div>
                        <div className="font-medium">
                          {results.count} values
                        </div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-sm text-muted-foreground">
                          Data Range
                        </div>
                        <div className="font-medium">
                          {results.min.toFixed(2)} to {results.max.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-sm text-muted-foreground">
                          Distribution
                        </div>
                        <div className="font-medium">
                          {results.skewness > 0.5
                            ? "Right-skewed"
                            : results.skewness < -0.5
                            ? "Left-skewed"
                            : "Approximately normal"}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => {
                        const randomValues = Array.from({ length: 50 }, () =>
                          Math.floor(Math.random() * 100)
                        );
                        const updatedDatasets = [...datasets];
                        updatedDatasets[activeDataset].values = randomValues;
                        setDatasets(updatedDatasets);
                        setInputText(randomValues.join(", "));
                        calculateStatistics(randomValues);
                        toast.success("Generated random dataset");
                      }}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Random Data
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => {
                        if (results) {
                          const normalizedValues = datasets[
                            activeDataset
                          ].values.map(
                            (value) =>
                              (value - results.mean) / results.standardDeviation
                          );
                          const updatedDatasets = [...datasets];
                          const newDataset = {
                            name: `Normalized ${datasets[activeDataset].name}`,
                            values: normalizedValues,
                            color: getRandomColor(),
                          };
                          updatedDatasets.push(newDataset);
                          setDatasets(updatedDatasets);
                          setActiveDataset(updatedDatasets.length - 1);
                          setInputText(normalizedValues.join(", "));
                          calculateStatistics(normalizedValues);
                          toast.success("Data normalized (z-scores)");
                        }
                      }}
                      disabled={!results}>
                      <Percent className="h-4 w-4 mr-2" />
                      Normalize Data (Z-scores)
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => {
                        if (
                          results &&
                          datasets[activeDataset].values.length > 0
                        ) {
                          const sortedValues = [
                            ...datasets[activeDataset].values,
                          ].sort((a, b) => a - b);
                          const updatedDatasets = [...datasets];
                          updatedDatasets[activeDataset].values = sortedValues;
                          setDatasets(updatedDatasets);
                          setInputText(sortedValues.join(", "));
                          toast.success("Data sorted in ascending order");
                        }
                      }}
                      disabled={!results}>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      Sort Data (Ascending)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default StatisticalCalculator;
