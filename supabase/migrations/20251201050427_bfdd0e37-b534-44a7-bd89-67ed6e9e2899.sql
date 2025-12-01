-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('super_admin', 'bursar', 'registrar', 'teacher', 'parent', 'student', 'auditor');
CREATE TYPE payment_method AS ENUM ('mpesa', 'stripe', 'bank_transfer', 'manual');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'partial', 'overdue', 'cancelled');
CREATE TYPE boarding_status AS ENUM ('day', 'boarding');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Terms table
CREATE TABLE public.terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guardians table
CREATE TABLE public.guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_no TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  guardian_id UUID REFERENCES public.guardians(id) ON DELETE SET NULL,
  boarding_status boarding_status NOT NULL DEFAULT 'day',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fee items table
CREATE TABLE public.fee_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  default_amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fee structures table (defines fees per class per term)
CREATE TABLE public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  fee_item_id UUID NOT NULL REFERENCES public.fee_items(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, term_id, fee_item_id)
);

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no TEXT NOT NULL UNIQUE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES public.terms(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status invoice_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invoice lines table
CREATE TABLE public.invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  fee_item_id UUID NOT NULL REFERENCES public.fee_items(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  payer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method payment_method NOT NULL,
  provider_ref TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- M-Pesa transactions table
CREATE TABLE public.mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  mpesa_receipt_no TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bank proofs table
CREATE TABLE public.bank_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  bank_ref TEXT NOT NULL,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scholarships and adjustments table
CREATE TABLE public.scholarships_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT NOT NULL,
  applied_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  data JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin (any admin role)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'bursar', 'registrar')
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles (only admins can manage)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for classes (everyone can view, admins can manage)
CREATE POLICY "Everyone can view classes"
  ON public.classes FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert classes"
  ON public.classes FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for terms (everyone can view, admins can manage)
CREATE POLICY "Everyone can view terms"
  ON public.terms FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage terms"
  ON public.terms FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for guardians
CREATE POLICY "Guardians can view own record"
  ON public.guardians FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all guardians"
  ON public.guardians FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage guardians"
  ON public.guardians FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for students
CREATE POLICY "Guardians can view their students"
  ON public.students FOR SELECT
  USING (
    guardian_id IN (
      SELECT id FROM public.guardians WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for fee_items (everyone can view, admins can manage)
CREATE POLICY "Everyone can view fee items"
  ON public.fee_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage fee items"
  ON public.fee_items FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for fee_structures (everyone can view, admins can manage)
CREATE POLICY "Everyone can view fee structures"
  ON public.fee_structures FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage fee structures"
  ON public.fee_structures FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for invoices
CREATE POLICY "Guardians can view their invoices"
  ON public.invoices FOR SELECT
  USING (
    guardian_id IN (
      SELECT id FROM public.guardians WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all invoices"
  ON public.invoices FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage invoices"
  ON public.invoices FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for invoice_lines
CREATE POLICY "Users can view invoice lines for accessible invoices"
  ON public.invoice_lines FOR SELECT
  USING (
    invoice_id IN (
      SELECT id FROM public.invoices
      WHERE guardian_id IN (
        SELECT id FROM public.guardians WHERE user_id = auth.uid()
      )
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage invoice lines"
  ON public.invoice_lines FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (
    payer_user_id = auth.uid()
    OR invoice_id IN (
      SELECT id FROM public.invoices
      WHERE guardian_id IN (
        SELECT id FROM public.guardians WHERE user_id = auth.uid()
      )
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Authenticated users can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for audit_logs (admins only)
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guardians_updated_at
  BEFORE UPDATE ON public.guardians
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();