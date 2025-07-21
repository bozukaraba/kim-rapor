-- Supabase için güvenli tablo oluşturma (IF NOT EXISTS kullanarak)

-- Kullanıcılar tablosu (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('analyst', 'manager', 'admin')),
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform verileri tablosu (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS public.platform_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  -- Metrics objesi için ayrı kolonlar
  metrics_followers INTEGER NOT NULL DEFAULT 0,
  metrics_engagement INTEGER NOT NULL DEFAULT 0,
  metrics_reach INTEGER NOT NULL DEFAULT 0,
  metrics_impressions INTEGER NOT NULL DEFAULT 0,
  metrics_clicks INTEGER NOT NULL DEFAULT 0,
  metrics_conversions INTEGER NOT NULL DEFAULT 0,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  entered_by TEXT NOT NULL,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- NULL olabilir (demo modu için)
);

-- Website verileri tablosu (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS public.website_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitors INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  avg_session_duration DECIMAL(8,2) NOT NULL DEFAULT 0.0,
  conversions INTEGER NOT NULL DEFAULT 0,
  top_pages TEXT[] DEFAULT '{}',
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  entered_by TEXT NOT NULL,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- NULL olabilir (demo modu için)
);

-- Haber verileri tablosu (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS public.news_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentions INTEGER NOT NULL DEFAULT 0,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  reach INTEGER NOT NULL DEFAULT 0,
  top_sources TEXT[] DEFAULT '{}',
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  entered_by TEXT NOT NULL,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- NULL olabilir (demo modu için)
);

-- RPA verileri tablosu (eğer yoksa oluştur) - EKSİK OLAN TABLO
CREATE TABLE IF NOT EXISTS public.rpa_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_incoming_mails INTEGER NOT NULL DEFAULT 0,
  total_distributed INTEGER NOT NULL DEFAULT 0,
  top_redirected_unit1 TEXT NOT NULL,
  top_redirected_unit2 TEXT NOT NULL,
  top_redirected_unit3 TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  entered_by TEXT NOT NULL,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- NULL olabilir (demo modu için)
);

-- Eski istatistikler tablosu (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS public.statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- NULL olabilir (demo modu için)
);

-- Raporlar tablosu (eğer yoksa oluştur)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) -- NULL olabilir (demo modu için)
);

-- RLS (Row Level Security) politikaları - Demo modu için geçici olarak devre dışı
-- Gerçek production'da bu politikaları aktiv edin

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can read their own data') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can read their own data" ON public.users FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'platform_data' AND policyname = 'Anyone can read platform data') THEN
    ALTER TABLE public.platform_data ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can read platform data" ON public.platform_data FOR SELECT TO authenticated USING (true);
    -- Demo modu için geçici policy - user_id NULL olabilir
    CREATE POLICY "Authenticated users can insert platform data" ON public.platform_data FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Users can update their own platform data" ON public.platform_data FOR UPDATE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
    CREATE POLICY "Users can delete their own platform data" ON public.platform_data FOR DELETE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'website_data' AND policyname = 'Anyone can read website data') THEN
    ALTER TABLE public.website_data ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can read website data" ON public.website_data FOR SELECT TO authenticated USING (true);
    -- Demo modu için geçici policy - user_id NULL olabilir
    CREATE POLICY "Authenticated users can insert website data" ON public.website_data FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Users can update their own website data" ON public.website_data FOR UPDATE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
    CREATE POLICY "Users can delete their own website data" ON public.website_data FOR DELETE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'news_data' AND policyname = 'Anyone can read news data') THEN
    ALTER TABLE public.news_data ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can read news data" ON public.news_data FOR SELECT TO authenticated USING (true);
    -- Demo modu için geçici policy - user_id NULL olabilir
    CREATE POLICY "Authenticated users can insert news data" ON public.news_data FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Users can update their own news data" ON public.news_data FOR UPDATE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
    CREATE POLICY "Users can delete their own news data" ON public.news_data FOR DELETE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- RPA verileri için politikalar (eğer yoksa oluştur)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rpa_data' AND policyname = 'Anyone can read RPA data') THEN
    ALTER TABLE public.rpa_data ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can read RPA data" ON public.rpa_data FOR SELECT TO authenticated USING (true);
    CREATE POLICY "Anyone can insert RPA data" ON public.rpa_data FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'statistics' AND policyname = 'Anyone can read statistics') THEN
    ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can read statistics" ON public.statistics FOR SELECT TO authenticated USING (true);
    -- Demo modu için geçici policy - user_id NULL olabilir
    CREATE POLICY "Authenticated users can insert statistics" ON public.statistics FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Users can update their own statistics" ON public.statistics FOR UPDATE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
    CREATE POLICY "Users can delete their own statistics" ON public.statistics FOR DELETE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reports' AND policyname = 'Anyone can read reports') THEN
    ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can read reports" ON public.reports FOR SELECT TO authenticated USING (true);
    -- Demo modu için geçici policy - user_id NULL olabilir
    CREATE POLICY "Authenticated users can insert reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Users can update their own reports" ON public.reports FOR UPDATE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
    CREATE POLICY "Users can delete their own reports" ON public.reports FOR DELETE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- Indexler (eğer yoksa oluştur)
CREATE INDEX IF NOT EXISTS idx_platform_data_user_id ON public.platform_data(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_data_month_year ON public.platform_data(month, year);
CREATE INDEX IF NOT EXISTS idx_platform_data_platform ON public.platform_data(platform);

CREATE INDEX IF NOT EXISTS idx_website_data_user_id ON public.website_data(user_id);
CREATE INDEX IF NOT EXISTS idx_website_data_month_year ON public.website_data(month, year);

CREATE INDEX IF NOT EXISTS idx_news_data_user_id ON public.news_data(user_id);
CREATE INDEX IF NOT EXISTS idx_news_data_month_year ON public.news_data(month, year);
CREATE INDEX IF NOT EXISTS idx_news_data_sentiment ON public.news_data(sentiment);

CREATE INDEX IF NOT EXISTS idx_statistics_user_id ON public.statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_statistics_platform ON public.statistics(platform);
CREATE INDEX IF NOT EXISTS idx_statistics_created_at ON public.statistics(created_at);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON public.reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON public.reports(generated_at);

-- Trigger fonksiyonu (eğer yoksa oluştur)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger (eğer yoksa oluştur)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_users_updated_at') THEN
    CREATE TRIGGER handle_users_updated_at
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Kullanıcı profili otomatik oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Kullanıcı'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'analyst'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Genel')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yeni kullanıcı trigger'ı (eğer yoksa oluştur)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- View (eğer yoksa oluştur)
CREATE OR REPLACE VIEW public.platform_data_with_metrics AS
SELECT 
  id,
  platform,
  jsonb_build_object(
    'followers', metrics_followers,
    'engagement', metrics_engagement,
    'reach', metrics_reach,
    'impressions', metrics_impressions,
    'clicks', metrics_clicks,
    'conversions', metrics_conversions
  ) as metrics,
  month,
  year,
  entered_by,
  entered_at,
  user_id
FROM public.platform_data; 