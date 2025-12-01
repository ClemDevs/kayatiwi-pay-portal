-- RLS Policies for mpesa_transactions (related to payments)
CREATE POLICY "Users can view own mpesa transactions"
  ON public.mpesa_transactions FOR SELECT
  USING (
    payment_id IN (
      SELECT id FROM public.payments
      WHERE payer_user_id = auth.uid()
      OR invoice_id IN (
        SELECT id FROM public.invoices
        WHERE guardian_id IN (
          SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
      )
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage mpesa transactions"
  ON public.mpesa_transactions FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for bank_proofs (related to payments)
CREATE POLICY "Users can view own bank proofs"
  ON public.bank_proofs FOR SELECT
  USING (
    payment_id IN (
      SELECT id FROM public.payments
      WHERE payer_user_id = auth.uid()
      OR invoice_id IN (
        SELECT id FROM public.invoices
        WHERE guardian_id IN (
          SELECT id FROM public.guardians WHERE user_id = auth.uid()
        )
      )
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Authenticated users can upload bank proofs"
  ON public.bank_proofs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage bank proofs"
  ON public.bank_proofs FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for scholarships_adjustments
CREATE POLICY "Guardians can view scholarships for their students"
  ON public.scholarships_adjustments FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM public.students
      WHERE guardian_id IN (
        SELECT id FROM public.guardians WHERE user_id = auth.uid()
      )
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage scholarships"
  ON public.scholarships_adjustments FOR ALL
  USING (public.is_admin(auth.uid()));