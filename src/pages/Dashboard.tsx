import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, CreditCard, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { PaymentDialog } from "@/components/PaymentDialog";

interface Student {
  id: string;
  admission_no: string;
  first_name: string;
  last_name: string;
  boarding_status: string;
  classes: {
    name: string;
  } | null;
}

interface Invoice {
  id: string;
  invoice_no: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  due_date: string;
  terms: {
    name: string;
  } | null;
  students: {
    first_name: string;
    last_name: string;
  } | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [guardianId, setGuardianId] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Get guardian record
      const { data: guardian, error: guardianError } = await supabase
        .from("guardians")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (guardianError || !guardian) {
        console.log("No guardian record found");
        setLoading(false);
        return;
      }

      setGuardianId(guardian.id);

      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select(`
          id,
          admission_no,
          first_name,
          last_name,
          boarding_status,
          classes (name)
        `)
        .eq("guardian_id", guardian.id);

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select(`
          id,
          invoice_no,
          total_amount,
          paid_amount,
          status,
          due_date,
          terms (name),
          students (first_name, last_name)
        `)
        .eq("guardian_id", guardian.id)
        .order("due_date", { ascending: false });

      if (invoicesError) throw invoicesError;
      setInvoices(invoicesData || []);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      paid: { variant: "default", label: "Paid" },
      partial: { variant: "secondary", label: "Partial" },
      overdue: { variant: "destructive", label: "Overdue" },
      issued: { variant: "outline", label: "Pending" },
    };

    const config = variants[status] || variants.issued;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const handlePayInvoice = (invoiceId: string) => {
    navigate(`/invoice/${invoiceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalOutstanding = invoices
    .filter(inv => inv.status !== "paid")
    .reduce((sum, inv) => sum + (inv.total_amount - inv.paid_amount), 0);

  const upcomingDue = invoices.filter(
    inv => inv.status === "issued" && new Date(inv.due_date) > new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Welcome Back, {user?.user_metadata?.full_name || "Parent"}
          </h1>
          <p className="text-muted-foreground">
            Manage your children's school fees and view payment history
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
              <p className="text-xs text-muted-foreground">
                Across {students.length} student{students.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Due</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingDue.length}</div>
              <p className="text-xs text-muted-foreground">
                Invoices due soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">
                Active enrollments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Pay Section - Most prominent */}
        {totalOutstanding > 0 && (
          <Card className="mb-8 border-primary bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Quick Pay Outstanding Fees
              </CardTitle>
              <CardDescription>
                Select a payment method to pay your outstanding balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary">{formatCurrency(totalOutstanding)}</p>
                <p className="text-sm text-muted-foreground">Total outstanding balance</p>
              </div>
              <Button
                size="lg"
                className="w-full h-auto py-4 text-lg"
                onClick={() => setPaymentDialogOpen(true)}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Pay Now
              </Button>
            </CardContent>
          </Card>
        )}

        <PaymentDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          amount={totalOutstanding}
        />

        {/* Students */}
        {students.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Students</CardTitle>
              <CardDescription>Students registered under your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.admission_no} • {student.classes?.name || "No Class"} • {student.boarding_status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>View and pay your fee statements</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{invoice.invoice_no}</h3>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.students?.first_name} {invoice.students?.last_name} • {invoice.terms?.name} • Due: {new Date(invoice.due_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {formatCurrency(invoice.total_amount)} {invoice.paid_amount > 0 && (
                          <span className="text-muted-foreground">
                            (Paid: {formatCurrency(invoice.paid_amount)})
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      onClick={() => handlePayInvoice(invoice.id)}
                      variant={invoice.status === "paid" ? "outline" : "default"}
                      size="sm"
                    >
                      {invoice.status === "paid" ? "View" : "Pay Now"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
