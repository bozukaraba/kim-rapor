-- Role-based access control için RLS policies

-- User roles için enum oluştur (eğer yoksa)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users tablosuna role kontrolü ekle
ALTER TABLE public.users ALTER COLUMN role TYPE user_role USING role::user_role;

-- Admin kontrolü için fonksiyon
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mevcut policy'leri kaldır ve yenilerini ekle

-- Platform Data Policies
DROP POLICY IF EXISTS "Demo access for platform_data" ON public.platform_data;
DROP POLICY IF EXISTS "Anyone can read platform data" ON public.platform_data;
DROP POLICY IF EXISTS "Authenticated users can insert platform data" ON public.platform_data;
DROP POLICY IF EXISTS "Users can update their own platform data" ON public.platform_data;
DROP POLICY IF EXISTS "Users can delete their own platform data" ON public.platform_data;

-- Admin tüm verileri görebilir, staff sadece kendi verilerini
CREATE POLICY "Admin can view all platform data" ON public.platform_data
  FOR SELECT TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- Herkes kendi verilerini ekleyebilir
CREATE POLICY "Users can insert their own platform data" ON public.platform_data
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admin tüm verileri güncelleyebilir, staff sadece kendi verilerini
CREATE POLICY "Admin can update all platform data" ON public.platform_data
  FOR UPDATE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- Admin tüm verileri silebilir, staff sadece kendi verilerini
CREATE POLICY "Admin can delete all platform data" ON public.platform_data
  FOR DELETE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- Website Data Policies
DROP POLICY IF EXISTS "Demo access for website_data" ON public.website_data;
DROP POLICY IF EXISTS "Anyone can read website data" ON public.website_data;
DROP POLICY IF EXISTS "Authenticated users can insert website data" ON public.website_data;
DROP POLICY IF EXISTS "Users can update their own website data" ON public.website_data;
DROP POLICY IF EXISTS "Users can delete their own website data" ON public.website_data;

CREATE POLICY "Admin can view all website data" ON public.website_data
  FOR SELECT TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own website data" ON public.website_data
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin can update all website data" ON public.website_data
  FOR UPDATE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all website data" ON public.website_data
  FOR DELETE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- News Data Policies
DROP POLICY IF EXISTS "Demo access for news_data" ON public.news_data;
DROP POLICY IF EXISTS "Anyone can read news data" ON public.news_data;
DROP POLICY IF EXISTS "Authenticated users can insert news data" ON public.news_data;
DROP POLICY IF EXISTS "Users can update their own news data" ON public.news_data;
DROP POLICY IF EXISTS "Users can delete their own news data" ON public.news_data;

CREATE POLICY "Admin can view all news data" ON public.news_data
  FOR SELECT TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own news data" ON public.news_data
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin can update all news data" ON public.news_data
  FOR UPDATE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all news data" ON public.news_data
  FOR DELETE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- Statistics Policies
DROP POLICY IF EXISTS "Demo access for statistics" ON public.statistics;
DROP POLICY IF EXISTS "Anyone can read statistics" ON public.statistics;
DROP POLICY IF EXISTS "Authenticated users can insert statistics" ON public.statistics;
DROP POLICY IF EXISTS "Users can update their own statistics" ON public.statistics;
DROP POLICY IF EXISTS "Users can delete their own statistics" ON public.statistics;

CREATE POLICY "Admin can view all statistics" ON public.statistics
  FOR SELECT TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own statistics" ON public.statistics
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin can update all statistics" ON public.statistics
  FOR UPDATE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all statistics" ON public.statistics
  FOR DELETE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- Reports Policies
DROP POLICY IF EXISTS "Demo access for reports" ON public.reports;
DROP POLICY IF EXISTS "Anyone can read reports" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can insert reports" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.reports;

CREATE POLICY "Admin can view all reports" ON public.reports
  FOR SELECT TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON public.reports
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin can update all reports" ON public.reports
  FOR UPDATE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admin can delete all reports" ON public.reports
  FOR DELETE TO authenticated 
  USING (is_admin() OR auth.uid() = user_id);

-- Demo data eklemek için geçici policy (isteğe bağlı)
-- Bu policy'i production'da kaldırın
CREATE POLICY "Demo mode access" ON public.platform_data
  FOR ALL TO anon 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Demo mode access" ON public.website_data
  FOR ALL TO anon 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Demo mode access" ON public.news_data
  FOR ALL TO anon 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Demo mode access" ON public.statistics
  FOR ALL TO anon 
  USING (true) 
  WITH CHECK (true);

-- Kullanıcı profili trigger'ını güncelle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Kullanıcı'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'staff'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Genel')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 