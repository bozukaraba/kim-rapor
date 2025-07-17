-- Supabase için tablo şemaları
-- Kullanıcılar tablosu (auth.users ile entegre)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst' CHECK (role IN ('analyst', 'manager', 'admin')),
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform verileri tablosu
CREATE TABLE public.platform_data (
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
  user_id UUID REFERENCES auth.users(id)
);

-- Website verileri tablosu
CREATE TABLE public.website_data (
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
  user_id UUID REFERENCES auth.users(id)
);

-- Haber verileri tablosu
CREATE TABLE public.news_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentions INTEGER NOT NULL DEFAULT 0,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  reach INTEGER NOT NULL DEFAULT 0,
  top_sources TEXT[] DEFAULT '{}',
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  entered_by TEXT NOT NULL,
  entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Eski istatistikler tablosu (DataEntry'deki eski form için)
CREATE TABLE public.statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Raporlar tablosu (otomatik rapor kaydetme için)
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id)
);

-- RLS (Row Level Security) politikaları
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar için politikalar
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Platform verileri için politikalar
CREATE POLICY "Anyone can read platform data" ON public.platform_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert platform data" ON public.platform_data
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform data" ON public.platform_data
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform data" ON public.platform_data
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Website verileri için politikalar
CREATE POLICY "Anyone can read website data" ON public.website_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert website data" ON public.website_data
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own website data" ON public.website_data
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own website data" ON public.website_data
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Haber verileri için politikalar
CREATE POLICY "Anyone can read news data" ON public.news_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert news data" ON public.news_data
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own news data" ON public.news_data
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news data" ON public.news_data
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- İstatistikler için politikalar
CREATE POLICY "Anyone can read statistics" ON public.statistics
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert statistics" ON public.statistics
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics" ON public.statistics
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own statistics" ON public.statistics
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Raporlar için politikalar
CREATE POLICY "Anyone can read reports" ON public.reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert reports" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.reports
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" ON public.reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indexler (performans için)
CREATE INDEX idx_platform_data_user_id ON public.platform_data(user_id);
CREATE INDEX idx_platform_data_month_year ON public.platform_data(month, year);
CREATE INDEX idx_platform_data_platform ON public.platform_data(platform);

CREATE INDEX idx_website_data_user_id ON public.website_data(user_id);
CREATE INDEX idx_website_data_month_year ON public.website_data(month, year);

CREATE INDEX idx_news_data_user_id ON public.news_data(user_id);
CREATE INDEX idx_news_data_month_year ON public.news_data(month, year);
CREATE INDEX idx_news_data_sentiment ON public.news_data(sentiment);

CREATE INDEX idx_statistics_user_id ON public.statistics(user_id);
CREATE INDEX idx_statistics_platform ON public.statistics(platform);
CREATE INDEX idx_statistics_created_at ON public.statistics(created_at);

CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_type ON public.reports(report_type);
CREATE INDEX idx_reports_generated_at ON public.reports(generated_at);

-- Trigger fonksiyonu (updated_at otomatik güncelleme)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger (users tablosu için)
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Yeni kullanıcı trigger'ı
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- View'ler (kolay veri erişimi için)
CREATE VIEW public.platform_data_with_metrics AS
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