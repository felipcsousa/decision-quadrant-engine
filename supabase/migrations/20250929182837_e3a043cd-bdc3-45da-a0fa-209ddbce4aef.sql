-- Fix search_path for validate_picpay_email function
CREATE OR REPLACE FUNCTION public.validate_picpay_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@picpay.com' THEN
    RAISE EXCEPTION 'Apenas emails corporativos @picpay.com são permitidos';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;