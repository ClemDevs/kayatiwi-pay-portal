-- This SQL file seeds the database with demo data
-- Run this in your Cloud backend SQL editor or use supabase--insert tool

-- Note: Classes, Terms, and Fee Items are already inserted

-- Create Fee Structures for all classes (Term 1)
INSERT INTO public.fee_structures (class_id, term_id, fee_item_id, amount)
SELECT 
  c.id as class_id,
  t.id as term_id,
  fi.id as fee_item_id,
  fi.default_amount as amount
FROM public.classes c
CROSS JOIN public.terms t
CROSS JOIN public.fee_items fi
WHERE t.name = 'Term 1 2025';

-- Create 200 sample guardians (without user accounts for demo)
INSERT INTO public.guardians (name, phone, email, address)
SELECT 
  'Guardian ' || gs.n,
  '+2547' || LPAD((70000000 + gs.n)::text, 8, '0'),
  'guardian' || gs.n || '@example.com',
  'P.O. Box ' || (1000 + gs.n) || ', Nairobi'
FROM generate_series(1, 200) gs(n);

-- Create 300 students distributed across classes
INSERT INTO public.students (admission_no, first_name, last_name, class_id, guardian_id, boarding_status)
SELECT 
  'KSS' || LPAD(ss.n::text, 4, '0'),
  CASE (ss.n % 20)
    WHEN 0 THEN 'John' WHEN 1 THEN 'Mary' WHEN 2 THEN 'Peter' WHEN 3 THEN 'Grace'
    WHEN 4 THEN 'James' WHEN 5 THEN 'Faith' WHEN 6 THEN 'David' WHEN 7 THEN 'Sarah'
    WHEN 8 THEN 'Samuel' WHEN 9 THEN 'Ruth' WHEN 10 THEN 'Daniel' WHEN 11 THEN 'Joy'
    WHEN 12 THEN 'Michael' WHEN 13 THEN 'Agnes' WHEN 14 THEN 'Joseph' WHEN 15 THEN 'Jane'
    WHEN 16 THEN 'Mark' WHEN 17 THEN 'Lucy' WHEN 18 THEN 'Paul' ELSE 'Anne'
  END,
  CASE (ss.n % 15)
    WHEN 0 THEN 'Kamau' WHEN 1 THEN 'Wanjiku' WHEN 2 THEN 'Ochieng' WHEN 3 THEN 'Akinyi'
    WHEN 4 THEN 'Mwangi' WHEN 5 THEN 'Njeri' WHEN 6 THEN 'Kiprop' WHEN 7 THEN 'Chebet'
    WHEN 8 THEN 'Otieno' WHEN 9 THEN 'Wairimu' WHEN 10 THEN 'Korir' WHEN 11 THEN 'Jepkorir'
    WHEN 12 THEN 'Mutua' WHEN 13 THEN 'Muthoni' ELSE 'Wekesa'
  END,
  c.id,
  g.id,
  CASE WHEN (ss.n % 3) = 0 THEN 'boarding' ELSE 'day' END
FROM generate_series(1, 300) ss(n)
CROSS JOIN LATERAL (
  SELECT id FROM public.classes ORDER BY random() LIMIT 1
) c
CROSS JOIN LATERAL (
  SELECT id FROM public.guardians ORDER BY random() LIMIT 1
) g;

-- Create sample invoices (100 invoices with various statuses)
INSERT INTO public.invoices (invoice_no, student_id, guardian_id, term_id, due_date, total_amount, paid_amount, status)
SELECT 
  'INV-2025-' || LPAD(inv.n::text, 4, '0'),
  s.id,
  s.guardian_id,
  t.id,
  '2025-02-15'::date,
  CASE 
    WHEN s.boarding_status = 'boarding' THEN 82500.00
    ELSE 57500.00
  END,
  CASE 
    WHEN (inv.n % 4) = 0 THEN 0
    WHEN (inv.n % 4) = 1 THEN CASE WHEN s.boarding_status = 'boarding' THEN 82500.00 ELSE 57500.00 END
    WHEN (inv.n % 4) = 2 THEN CASE WHEN s.boarding_status = 'boarding' THEN 40000.00 ELSE 30000.00 END
    ELSE 0
  END,
  CASE 
    WHEN (inv.n % 4) = 1 THEN 'paid'
    WHEN (inv.n % 4) = 2 THEN 'partial'
    ELSE 'issued'
  END
FROM generate_series(1, 100) inv(n)
JOIN public.students s ON s.id = (SELECT id FROM public.students ORDER BY random() LIMIT 1)
JOIN public.terms t ON t.name = 'Term 1 2025';

-- Note: Invoice lines and payments would need to be generated based on the invoices created above
-- This provides the base structure for demo purposes