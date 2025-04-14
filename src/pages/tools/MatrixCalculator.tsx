
import React, { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Calculator, X, Plus, Minus, Divide } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MatrixCalculator = () => {
  const [operation, setOperation] = useState<string>("add");
  const [matrixARows, setMatrixARows] = useState<number>(2);
  const [matrixACols, setMatrixACols] = useState<number>(2);
  const [matrixBRows, setMatrixBRows] = useState<number>(2);
  const [matrixBCols, setMatrixBCols] = useState<number>(2);
  const [matrixA, setMatrixA] = useState<number[][]>([]);
  const [matrixB, setMatrixB] = useState<number[][]>([]);
  const [result, setResult] = useState<number[][]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize matrices with zeros
  useEffect(() => {
    resetMatrix("A");
  }, [matrixARows, matrixACols]);

  useEffect(() => {
    resetMatrix("B");
  }, [matrixBRows, matrixBCols]);

  // Reset matrix with zeros
  const resetMatrix = (matrix: string) => {
    if (matrix === "A") {
      const newMatrix = Array(matrixARows).fill(0).map(() => Array(matrixACols).fill(0));
      setMatrixA(newMatrix);
    } else if (matrix === "B") {
      const newMatrix = Array(matrixBRows).fill(0).map(() => Array(matrixBCols).fill(0));
      setMatrixB(newMatrix);
    }
  };

  // Update a matrix cell
  const updateMatrixCell = (
    matrix: string,
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const numValue = value === "" ? 0 : Number(value);
    
    if (isNaN(numValue)) {
      return; // Ignore non-numeric input
    }
    
    if (matrix === "A") {
      const newMatrix = [...matrixA];
      newMatrix[rowIndex][colIndex] = numValue;
      setMatrixA(newMatrix);
    } else if (matrix === "B") {
      const newMatrix = [...matrixB];
      newMatrix[rowIndex][colIndex] = numValue;
      setMatrixB(newMatrix);
    }
  };

  // Calculate the result
  const calculateResult = () => {
    setError(null);
    
    try {
      if (operation === "add" || operation === "subtract") {
        // For addition and subtraction, matrices must have the same dimensions
        if (matrixARows !== matrixBRows || matrixACols !== matrixBCols) {
          setError("Matrix dimensions must be the same for addition or subtraction.");
          return;
        }
        
        const resultMatrix = Array(matrixARows)
          .fill(0)
          .map(() => Array(matrixACols).fill(0));
        
        for (let i = 0; i < matrixARows; i++) {
          for (let j = 0; j < matrixACols; j++) {
            if (operation === "add") {
              resultMatrix[i][j] = matrixA[i][j] + matrixB[i][j];
            } else {
              resultMatrix[i][j] = matrixA[i][j] - matrixB[i][j];
            }
          }
        }
        
        setResult(resultMatrix);
      } else if (operation === "multiply") {
        // For multiplication, the number of columns in A must equal the number of rows in B
        if (matrixACols !== matrixBRows) {
          setError(
            "Matrix A columns must equal Matrix B rows for multiplication."
          );
          return;
        }
        
        const resultMatrix = Array(matrixARows)
          .fill(0)
          .map(() => Array(matrixBCols).fill(0));
        
        for (let i = 0; i < matrixARows; i++) {
          for (let j = 0; j < matrixBCols; j++) {
            resultMatrix[i][j] = 0;
            for (let k = 0; k < matrixACols; k++) {
              resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j];
            }
          }
        }
        
        setResult(resultMatrix);
      } else if (operation === "transpose") {
        // Transpose only uses Matrix A
        const resultMatrix = Array(matrixACols)
          .fill(0)
          .map(() => Array(matrixARows).fill(0));
        
        for (let i = 0; i < matrixARows; i++) {
          for (let j = 0; j < matrixACols; j++) {
            resultMatrix[j][i] = matrixA[i][j];
          }
        }
        
        setResult(resultMatrix);
      } else if (operation === "determinant") {
        // Determinant only works for square matrices
        if (matrixARows !== matrixACols) {
          setError("Matrix must be square to calculate determinant.");
          return;
        }
        
        const det = calculateDeterminant(matrixA);
        setResult([[det]]);
        toast.success(`Determinant: ${det}`);
      }
    } catch (error) {
      setError("An error occurred during calculation.");
      console.error(error);
    }
  };

  // Calculate determinant recursively
  const calculateDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    
    // Base case: 1x1 matrix
    if (n === 1) {
      return matrix[0][0];
    }
    
    // Base case: 2x2 matrix
    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      // Create submatrix
      const subMatrix: number[][] = [];
      for (let i = 1; i < n; i++) {
        const row: number[] = [];
        for (let k = 0; k < n; k++) {
          if (k !== j) {
            row.push(matrix[i][k]);
          }
        }
        subMatrix.push(row);
      }
      
      // Calculate determinant recursively
      const sign = j % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][j] * calculateDeterminant(subMatrix);
    }
    
    return det;
  };

  // Clear all matrices
  const clearAll = () => {
    resetMatrix("A");
    resetMatrix("B");
    setResult([]);
    setError(null);
    toast.success("All matrices cleared");
  };

  // Render matrix input
  const renderMatrixInput = (
    matrix: number[][],
    rows: number,
    cols: number,
    matrixName: string
  ) => {
    return (
      <div className="border border-border rounded-md p-2 overflow-x-auto">
        <table className="w-full">
          <tbody>
            {Array(rows)
              .fill(0)
              .map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array(cols)
                    .fill(0)
                    .map((_, colIndex) => (
                      <td key={colIndex} className="p-1">
                        <Input
                          type="number"
                          value={matrix[rowIndex]?.[colIndex] || 0}
                          onChange={(e) =>
                            updateMatrixCell(
                              matrixName,
                              rowIndex,
                              colIndex,
                              e.target.value
                            )
                          }
                          className="w-16 h-10 text-center"
                        />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render result matrix
  const renderResultMatrix = (matrix: number[][]) => {
    if (!matrix || matrix.length === 0) return null;
    
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    return (
      <div className="border border-border rounded-md p-2 overflow-x-auto bg-muted/30">
        <table className="w-full">
          <tbody>
            {Array(rows)
              .fill(0)
              .map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array(cols)
                    .fill(0)
                    .map((_, colIndex) => (
                      <td key={colIndex} className="p-1">
                        <div className="w-16 h-10 flex items-center justify-center font-mono">
                          {matrix[rowIndex][colIndex]}
                        </div>
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Change operation
  const handleOperationChange = (value: string) => {
    setOperation(value);
    setResult([]);
    setError(null);
  };

  return (
    <ToolLayout
      title="Matrix Calculator"
      description="Perform matrix operations like addition, subtraction, multiplication, and more. All calculations are done locally in your browser."
      icon={<Calculator className="h-6 w-6 text-primary" />}
      category="Mathematics"
    >
      <div className="container max-w-4xl mx-auto">
        <Tabs defaultValue="operations" className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="operations">Matrix Operations</TabsTrigger>
            <TabsTrigger value="help">Help & Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Matrix Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="operation">Select Operation</Label>
                    <Select 
                      value={operation} 
                      onValueChange={handleOperationChange}
                    >
                      <SelectTrigger id="operation">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Addition (A + B)</SelectItem>
                        <SelectItem value="subtract">Subtraction (A - B)</SelectItem>
                        <SelectItem value="multiply">Multiplication (A × B)</SelectItem>
                        <SelectItem value="transpose">Transpose (A^T)</SelectItem>
                        <SelectItem value="determinant">Determinant |A|</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Matrix A Size</Label>
                    <div className="flex space-x-2">
                      <Select 
                        value={matrixARows.toString()} 
                        onValueChange={(val) => setMatrixARows(parseInt(val))}
                      >
                        <SelectTrigger id="matrixARows">
                          <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} rows
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={matrixACols.toString()} 
                        onValueChange={(val) => setMatrixACols(parseInt(val))}
                      >
                        <SelectTrigger id="matrixACols">
                          <SelectValue placeholder="Columns" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} cols
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {(operation !== "transpose" && operation !== "determinant") && (
                    <div className="space-y-2">
                      <Label>Matrix B Size</Label>
                      <div className="flex space-x-2">
                        <Select 
                          value={matrixBRows.toString()} 
                          onValueChange={(val) => setMatrixBRows(parseInt(val))}
                        >
                          <SelectTrigger id="matrixBRows">
                            <SelectValue placeholder="Rows" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} rows
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          value={matrixBCols.toString()} 
                          onValueChange={(val) => setMatrixBCols(parseInt(val))}
                        >
                          <SelectTrigger id="matrixBCols">
                            <SelectValue placeholder="Columns" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} cols
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="block mb-2">Matrix A</Label>
                    {renderMatrixInput(matrixA, matrixARows, matrixACols, "A")}
                  </div>
                  
                  {(operation !== "transpose" && operation !== "determinant") && (
                    <div>
                      <Label className="block mb-2">Matrix B</Label>
                      {renderMatrixInput(matrixB, matrixBRows, matrixBCols, "B")}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Button onClick={calculateResult}>Calculate</Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-6">
                    {error}
                  </div>
                )}

                {result && result.length > 0 && (
                  <div>
                    <Label className="block mb-2">Result</Label>
                    {renderResultMatrix(result)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Help & Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Matrix Operations</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Addition (A + B)</strong>: Adds corresponding elements of matrices A and B. Matrices must have the same dimensions.
                    </li>
                    <li>
                      <strong>Subtraction (A - B)</strong>: Subtracts corresponding elements of matrix B from matrix A. Matrices must have the same dimensions.
                    </li>
                    <li>
                      <strong>Multiplication (A × B)</strong>: Multiplies matrices A and B. The number of columns in A must equal the number of rows in B.
                    </li>
                    <li>
                      <strong>Transpose (A^T)</strong>: Flips matrix A over its diagonal, switching rows and columns.
                    </li>
                    <li>
                      <strong>Determinant |A|</strong>: Calculates the determinant of square matrix A.
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Example Use Cases</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Solving systems of linear equations</li>
                    <li>Computer graphics transformations (rotation, scaling, etc.)</li>
                    <li>Data analysis in statistics</li>
                    <li>Network analysis in computer science</li>
                    <li>Economic models and input-output analysis</li>
                  </ul>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tips</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>For large determinant calculations, results may be approximated due to floating-point arithmetic.</li>
                    <li>Matrix calculations can be computationally intensive for very large matrices.</li>
                    <li>All calculations are performed locally in your browser, protecting your data privacy.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default MatrixCalculator;
