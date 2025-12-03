import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Smartphone, CreditCard, Building2, Loader2, CheckCircle } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  invoiceNo?: string;
}

type PaymentMethod = "mpesa" | "card" | "bank" | null;
type PaymentStep = "select" | "details" | "processing" | "success";

export function PaymentDialog({ open, onOpenChange, amount, invoiceNo }: PaymentDialogProps) {
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [step, setStep] = useState<PaymentStep>("select");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amt);
  };

  const handleSelectMethod = (selectedMethod: PaymentMethod) => {
    setMethod(selectedMethod);
    setStep("details");
  };

  const handleBack = () => {
    setMethod(null);
    setStep("select");
  };

  const handleClose = () => {
    setMethod(null);
    setStep("select");
    setPhone("");
    onOpenChange(false);
  };

  const handleMpesaPayment = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setStep("processing");

    // Simulate STK push - in production this would call the M-Pesa API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setStep("success");
    toast.success("STK Push sent to your phone!", {
      description: "Please enter your M-Pesa PIN to complete payment.",
    });
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setStep("processing");

    // Simulate redirect to Stripe - in production this would create a Stripe session
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    toast.info("Redirecting to secure payment page...", {
      description: "Card payment integration coming soon!",
    });
    handleClose();
  };

  const handleBankTransfer = () => {
    toast.success("Bank details copied!", {
      description: "Please upload your payment proof after transfer.",
    });
    setStep("success");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "select" && "Choose Payment Method"}
            {step === "details" && method === "mpesa" && "M-Pesa Payment"}
            {step === "details" && method === "card" && "Card Payment"}
            {step === "details" && method === "bank" && "Bank Transfer"}
            {step === "processing" && "Processing..."}
            {step === "success" && "Payment Initiated"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" && `Amount to pay: ${formatCurrency(amount)}`}
            {invoiceNo && step === "select" && ` • Invoice: ${invoiceNo}`}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="grid gap-3 py-4">
            <Button
              variant="outline"
              size="lg"
              className="h-auto py-4 justify-start hover:border-primary hover:bg-primary/5"
              onClick={() => handleSelectMethod("mpesa")}
            >
              <Smartphone className="mr-3 h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">M-Pesa STK Push</div>
                <div className="text-sm text-muted-foreground">
                  Receive payment prompt on your phone
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-auto py-4 justify-start hover:border-primary hover:bg-primary/5"
              onClick={() => handleSelectMethod("card")}
            >
              <CreditCard className="mr-3 h-6 w-6 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Credit/Debit Card</div>
                <div className="text-sm text-muted-foreground">
                  Visa, Mastercard accepted
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-auto py-4 justify-start hover:border-primary hover:bg-primary/5"
              onClick={() => handleSelectMethod("bank")}
            >
              <Building2 className="mr-3 h-6 w-6 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold">Bank Transfer</div>
                <div className="text-sm text-muted-foreground">
                  Direct bank deposit
                </div>
              </div>
            </Button>
          </div>
        )}

        {step === "details" && method === "mpesa" && (
          <div className="py-4 space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {formatCurrency(amount)}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                Amount to be deducted
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g., 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />
              <p className="text-xs text-muted-foreground">
                Enter the phone number registered with M-Pesa
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleMpesaPayment} className="flex-1 bg-green-600 hover:bg-green-700">
                Send STK Push
              </Button>
            </div>
          </div>
        )}

        {step === "details" && method === "card" && (
          <div className="py-4 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {formatCurrency(amount)}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-500">
                Secure payment via Stripe
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              You will be redirected to a secure payment page to enter your card details.
            </p>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleCardPayment} className="flex-1">
                Proceed to Pay
              </Button>
            </div>
          </div>
        )}

        {step === "details" && method === "bank" && (
          <div className="py-4 space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {formatCurrency(amount)}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-500">
                Transfer this amount to:
              </p>
            </div>

            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">Kenya Commercial Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-medium">Kayatiwi Senior School</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account No:</span>
                <span className="font-medium">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <span className="font-medium">Nairobi Main</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              After making the transfer, please upload your payment proof for verification.
            </p>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button onClick={handleBankTransfer} className="flex-1">
                I've Made the Transfer
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Processing your payment...</p>
          </div>
        )}

        {step === "success" && method === "mpesa" && (
          <div className="py-6 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">STK Push Sent!</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Check your phone and enter your M-Pesa PIN to complete the payment.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full mt-2">
              Done
            </Button>
          </div>
        )}

        {step === "success" && method === "bank" && (
          <div className="py-6 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Transfer Details Noted</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Please complete the bank transfer and upload your proof of payment.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full mt-2">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
