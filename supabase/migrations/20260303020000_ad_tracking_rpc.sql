
-- RPC to increment ad impressions
CREATE OR REPLACE FUNCTION public.increment_ad_impressions(ad_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.ads
    SET impressions = COALESCE(impressions, 0) + 1
    WHERE id = ad_id;
END;
$$;

-- RPC to increment ad clicks
CREATE OR REPLACE FUNCTION public.increment_ad_clicks(ad_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.ads
    SET clicks = COALESCE(clicks, 0) + 1
    WHERE id = ad_id;
END;
$$;

-- Grant access to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.increment_ad_impressions TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.increment_ad_clicks TO authenticated, anon;
