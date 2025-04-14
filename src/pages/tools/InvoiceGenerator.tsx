
import React, { useState } from 'react';
import ToolLayout from "@/components/ToolLayout";
import { Receipt, Plus, Trash, Eye, Download, FileText, Clock, CreditCard, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  paymentTerms: string;
  items: InvoiceItem[];
  notes: string;
}

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    companyName: 'Your Company Name',
    companyAddress: '123 Business St., City, Country',
    clientName: 'Client Name',
    clientAddress: 'Client Address, City, Country',
    paymentTerms: 'Due within 30 days',
    items: [
      {
        id: '1',
        description: 'Service or Product Description',
        quantity: 1,
        price: 100.00
      }
    ],
    notes: 'Thank you for your business!'
  });
  
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0
    };
    setInvoiceData({ ...invoiceData, items: [...invoiceData.items, newItem] });
  };

  const removeItem = (index: number) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handlePrint = () => {
    // Create a printable version of the invoice
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      // Dark theme styles
      const darkThemeStyles = `
        body {
          background-color: #1a1a1a;
          color: #e0e0e0;
          font-family: 'Inter', sans-serif;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          background-color: #262626;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-title {
          color: #ffffff;
          font-size: 32px;
          font-weight: bold;
        }
        .invoice-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .company-info, .client-info {
          flex: 1;
        }
        .info-label {
          color: #a0a0a0;
          margin-bottom: 5px;
          font-size: 14px;
        }
        .info-value {
          margin-bottom: 15px;
          font-size: 16px;
        }
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .invoice-table th {
          background-color: #333333;
          color: #ffffff;
          text-align: left;
          padding: 10px;
          border-bottom: 2px solid #444444;
        }
        .invoice-table td {
          padding: 10px;
          border-bottom: 1px solid #444444;
        }
        .amount-right {
          text-align: right;
        }
        .invoice-totals {
          margin-left: auto;
          width: 50%;
          margin-bottom: 30px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .grand-total {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #444444;
          padding-top: 10px;
          margin-top: 10px;
        }
        .notes {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #444444;
          color: #a0a0a0;
        }
        .print-button {
          display: none;
        }
      `;

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoiceData.invoiceNumber}</title>
            <style>${darkThemeStyles}</style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="invoice-header">
                <div>
                  <div class="invoice-title">INVOICE</div>
                  <div class="info-value">#${invoiceData.invoiceNumber}</div>
                </div>
                <div>
                  <div class="info-label">Date</div>
                  <div class="info-value">${invoiceData.date}</div>
                  <div class="info-label">Due Date</div>
                  <div class="info-value">${invoiceData.dueDate}</div>
                </div>
              </div>
              
              <div class="invoice-info">
                <div class="company-info">
                  <div class="info-label">From</div>
                  <div class="info-value">${invoiceData.companyName}</div>
                  <div class="info-value">${invoiceData.companyAddress.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="client-info">
                  <div class="info-label">To</div>
                  <div class="info-value">${invoiceData.clientName}</div>
                  <div class="info-value">${invoiceData.clientAddress.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              
              <table class="invoice-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoiceData.items.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>${formatCurrency(item.price)}</td>
                      <td class="amount-right">${formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="invoice-totals">
                <div class="total-row">
                  <div>Subtotal</div>
                  <div>${formatCurrency(calculateSubtotal())}</div>
                </div>
                <div class="total-row">
                  <div>Tax (10%)</div>
                  <div>${formatCurrency(calculateTax())}</div>
                </div>
                <div class="total-row grand-total">
                  <div>Total</div>
                  <div>${formatCurrency(calculateTotal())}</div>
                </div>
              </div>
              
              <div class="info-value">${invoiceData.paymentTerms}</div>
              
              <div class="notes">
                <div class="info-label">Notes</div>
                <div>${invoiceData.notes.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      toast.success("Preparing invoice for printing");
    } else {
      toast.error("Unable to open print window. Please check your browser settings.");
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <ToolLayout
      title="Invoice Generator"
      description="Create professional invoices"
      icon={<Receipt className="h-6 w-6 text-indigo-500" />}
    >
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="preview" onClick={() => setShowPreview(true)}>Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-500" />
                      Invoice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                          id="invoiceNumber"
                          value={invoiceData.invoiceNumber}
                          onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={invoiceData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={invoiceData.dueDate}
                          onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="paymentTerms">Payment Terms</Label>
                        <Input
                          id="paymentTerms"
                          value={invoiceData.paymentTerms}
                          onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-indigo-500" />
                        Your Company
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={invoiceData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="companyAddress">Company Address</Label>
                        <textarea
                          id="companyAddress"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={invoiceData.companyAddress}
                          onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-indigo-500" />
                        Client
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                          id="clientName"
                          value={invoiceData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientAddress">Client Address</Label>
                        <textarea
                          id="clientAddress"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={invoiceData.clientAddress}
                          onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-500" />
                      Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      {invoiceData.items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-5">
                            <Label htmlFor={`item-${index}-desc`} className="sr-only">Description</Label>
                            <Input
                              id={`item-${index}-desc`}
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor={`item-${index}-qty`} className="sr-only">Quantity</Label>
                            <Input
                              id={`item-${index}-qty`}
                              type="number"
                              placeholder="Qty"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-3">
                            <Label htmlFor={`item-${index}-price`} className="sr-only">Price</Label>
                            <Input
                              id={`item-${index}-price`}
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={item.price}
                              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-1 text-right font-medium">
                            {formatCurrency(item.quantity * item.price)}
                          </div>
                          <div className="col-span-1">
                            {invoiceData.items.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                                className="h-8 w-8"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2 ml-auto w-1/2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax (10%):</span>
                        <span>{formatCurrency(calculateTax())}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Add any additional information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={invoiceData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Thank you for your business!"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={togglePreview}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={handlePrint}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate PDF
                    </Button>
                  </CardContent>
                </Card>
                
                {showPreview && (
                  <Card className="bg-[#262626] text-white border-0">
                    <CardHeader>
                      <CardTitle className="text-white">Preview</CardTitle>
                      <CardDescription className="text-gray-400">Dark-themed preview of your invoice</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-6 rounded-md bg-[#262626] shadow-lg text-white max-h-[800px] overflow-auto">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h1 className="text-2xl font-bold text-white">INVOICE</h1>
                            <p className="text-gray-300">#{invoiceData.invoiceNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="mb-2">{invoiceData.date}</p>
                            <p className="text-sm text-gray-400">Due Date</p>
                            <p>{invoiceData.dueDate}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 mb-8">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">From</p>
                            <p className="font-medium">{invoiceData.companyName}</p>
                            <p className="text-gray-300 whitespace-pre-line">{invoiceData.companyAddress}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">To</p>
                            <p className="font-medium">{invoiceData.clientName}</p>
                            <p className="text-gray-300 whitespace-pre-line">{invoiceData.clientAddress}</p>
                          </div>
                        </div>
                        
                        <div className="mb-8">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b border-gray-700">
                                <th className="py-2 text-gray-300">Description</th>
                                <th className="py-2 text-gray-300">Qty</th>
                                <th className="py-2 text-gray-300">Price</th>
                                <th className="py-2 text-gray-300 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceData.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                  <td className="py-2">{item.description || '-'}</td>
                                  <td className="py-2">{item.quantity}</td>
                                  <td className="py-2">{formatCurrency(item.price)}</td>
                                  <td className="py-2 text-right">{formatCurrency(item.quantity * item.price)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="w-1/2 ml-auto mb-8">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-300">Subtotal</span>
                            <span>{formatCurrency(calculateSubtotal())}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-gray-300">Tax (10%)</span>
                            <span>{formatCurrency(calculateTax())}</span>
                          </div>
                          <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-700 mt-2">
                            <span>Total</span>
                            <span>{formatCurrency(calculateTotal())}</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="mb-2">{invoiceData.paymentTerms}</p>
                          <div className="mt-8 pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400 mb-1">Notes</p>
                            <p className="text-gray-300 whitespace-pre-line">{invoiceData.notes}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-[#1e1e1e]">
                      <Button 
                        variant="default" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={handlePrint}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="bg-[#262626] rounded-lg p-8 shadow-xl text-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white">INVOICE</h1>
                  <p className="text-gray-300 text-lg">#{invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="mb-2">{invoiceData.date}</p>
                  <p className="text-sm text-gray-400">Due Date</p>
                  <p>{invoiceData.dueDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-1">From</p>
                  <p className="font-medium text-lg">{invoiceData.companyName}</p>
                  <p className="text-gray-300 whitespace-pre-line">{invoiceData.companyAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">To</p>
                  <p className="font-medium text-lg">{invoiceData.clientName}</p>
                  <p className="text-gray-300 whitespace-pre-line">{invoiceData.clientAddress}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="py-3 text-gray-300">Description</th>
                      <th className="py-3 text-gray-300">Qty</th>
                      <th className="py-3 text-gray-300">Price</th>
                      <th className="py-3 text-gray-300 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3">{item.description || '-'}</td>
                        <td className="py-3">{item.quantity}</td>
                        <td className="py-3">{formatCurrency(item.price)}</td>
                        <td className="py-3 text-right">{formatCurrency(item.quantity * item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="w-1/2 ml-auto mb-8">
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Subtotal</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">Tax (10%)</span>
                  <span>{formatCurrency(calculateTax())}</span>
                </div>
                <div className="flex justify-between py-3 text-xl font-bold border-t border-gray-700 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
              
              <div>
                <p className="mb-4 text-lg">{invoiceData.paymentTerms}</p>
                <div className="mt-8 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-1">Notes</p>
                  <p className="text-gray-300 whitespace-pre-line">{invoiceData.notes}</p>
                </div>
              </div>
              
              <div className="mt-10 flex justify-center">
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handlePrint}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice PDF
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default InvoiceGenerator;
