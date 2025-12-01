import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Zap, Clock, CheckCircle2, CreditCard, Smartphone, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-sm font-semibold text-primary">Powered by ClemDevs</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Pay School Fees
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
            Secure • Fast • Trackable
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Kayatiwi Senior School's official fee payment portal. View statements, make payments, and track your fee history — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="text-lg px-8 shadow-strong">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Why Choose Our Portal?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A modern, secure platform designed to make school fee payments effortless for parents and guardians.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Your payment information is encrypted and protected with industry-standard security protocols
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Instant Processing</CardTitle>
                <CardDescription>
                  Payments are processed immediately with instant confirmation and receipt generation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-success mb-4" />
                <CardTitle>24/7 Access</CardTitle>
                <CardDescription>
                  View statements and make payments anytime, anywhere from your phone or computer
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to manage your school fees
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-heading font-semibold mb-2">Create Account</h3>
              <p className="text-sm text-muted-foreground">
                Register with your email and link your children
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-heading font-semibold mb-2">View Statement</h3>
              <p className="text-sm text-muted-foreground">
                See detailed fee breakdown for each term
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-heading font-semibold mb-2">Make Payment</h3>
              <p className="text-sm text-muted-foreground">
                Choose M-Pesa, card, or bank transfer
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-heading font-semibold mb-2">Get Receipt</h3>
              <p className="text-sm text-muted-foreground">
                Download and print your official receipt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Multiple Payment Options
            </h2>
            <p className="text-muted-foreground text-lg">
              Pay your way with flexible payment methods
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center shadow-medium">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle>M-Pesa</CardTitle>
                <CardDescription>
                  Instant payment with M-Pesa STK Push
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-medium">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Debit/Credit Card</CardTitle>
                <CardDescription>
                  Visa and Mastercard accepted
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-medium">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Bank Transfer</CardTitle>
                <CardDescription>
                  Direct bank deposit with verification
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join hundreds of parents already using our secure payment portal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Account
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white hover:bg-white/90">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Kayatiwi Senior School. All rights reserved. Powered by ClemDevs
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
