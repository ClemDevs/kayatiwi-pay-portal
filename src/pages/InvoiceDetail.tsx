import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, CreditCard, Smartphone, Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { KayatiwiLogo } from "@/components/KayatiwiLogo";

interface InvoiceData {
  id: string;
  invoice_no: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  due_date: string;
  created_at: string;
  terms: {
    name: string;
    start_date: string;
    end_date: string;
  } | null;
  students: {
    admission_no: string;
    first_name: string;
    last_name: string;
    boarding_status: string;
    classes: {
      name: string;
    } | null;
  } | null;
  guardians: {
    name: string;
    phone: string;
    email: string;
  } | null;
  invoice_lines: Array<{
    description: string;
    amount: number;
  }>;
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          terms (name, start_date, end_date),
          students (admission_no, first_name, last_name, boarding_status, classes (name)),
          guardians (name, phone, email),
          invoice_lines (description, amount)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setInvoice(data);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to load invoice");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      paid: { variant: "default", label: "Paid" },
      partial: { variant: "secondary", label: "Partial" },
      overdue: { variant: "destructive", label: "Overdue" },
      issued: { variant: "outline", label: "Pending" },
    };

    const config = variants[status] || variants.issued;
    return <Badge variant={config.variant} className="text-sm">{config.label}</Badge>;
  };

  const handlePayment = (method: string) => {
    toast.info(`${method} payment integration will be available soon!`, {
      description: "This is a demo mode showing the payment flow.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  const balanceDue = invoice.total_amount - invoice.paid_amount;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Invoice Card */}
        <Card className="shadow-strong mb-6">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <KayatiwiLogo size="md" />
                  <div>
                    <h2 className="text-sm font-semibold text-muted-foreground">Kayatiwi Senior School</h2>
                    <p className="text-xs text-muted-foreground">Official Invoice</p>
                  </div>
                </div>
                <CardTitle className="text-2xl mt-4">{invoice.invoice_no}</CardTitle>
                <CardDescription className="mt-1">
                  Issued: {new Date(invoice.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {getStatusBadge(invoice.status)}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Student & Guardian Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Student Details</h3>
                <p className="font-semibold">
                  {invoice.students?.first_name} {invoice.students?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.students?.admission_no}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.students?.classes?.name} • {invoice.students?.boarding_status}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Guardian Details</h3>
                <p className="font-semibold">{invoice.guardians?.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.guardians?.phone}</p>
                <p className="text-sm text-muted-foreground">{invoice.guardians?.email}</p>
              </div>
            </div>

            {/* Term Info */}
            <div className="mb-6 pb-6 border-b border-border">
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Academic Term</h3>
              <p className="font-semibold">{invoice.terms?.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(invoice.terms?.start_date || "").toLocaleDateString()} -{" "}
                {new Date(invoice.terms?.end_date || "").toLocaleDateString()}
              </p>
              <p className="text-sm font-medium mt-1">
                Due Date: {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>

            {/* Fee Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Fee Breakdown</h3>
              <div className="space-y-3">
                {invoice.invoice_lines.map((line, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-sm">{line.description}</span>
                    <span className="font-semibold">{formatCurrency(line.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold">{formatCurrency(invoice.total_amount)}</span>
              </div>
              {invoice.paid_amount > 0 && (
                <div className="flex justify-between items-center text-success">
                  <span>Paid</span>
                  <span className="font-semibold">-{formatCurrency(invoice.paid_amount)}</span>
                </div>
              )}
              {balanceDue > 0 && (
                <div className="flex justify-between items-center text-2xl pt-2 border-t border-border">
                  <span className="font-bold">Balance Due</span>
                  <span className="font-bold text-primary">{formatCurrency(balanceDue)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        {balanceDue > 0 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 justify-start"
                  onClick={() => handlePayment("M-Pesa")}
                >
                  <Smartphone className="mr-3 h-5 w-5 text-success" />
                  <div className="text-left">
                    <div className="font-semibold">M-Pesa STK Push</div>
                    <div className="text-sm text-muted-foreground">Pay instantly with your phone</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 justify-start"
                  onClick={() => handlePayment("Card")}
                >
                  <CreditCard className="mr-3 h-5 w-5 text-accent" />
                  <div className="text-left">
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-muted-foreground">Visa, Mastercard accepted</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto py-4 justify-start"
                  onClick={() => handlePayment("Bank Transfer")}
                >
                  <Building2 className="mr-3 h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-muted-foreground">Direct bank deposit</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {invoice.status === "paid" && (
          <Button variant="outline" className="w-full mt-6" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        )}
      </main>
    </div>
  );
}
