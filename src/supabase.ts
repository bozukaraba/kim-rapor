// Supabase yapılandırma dosyası
import { createClient } from '@supabase/supabase-js'

// TODO: Supabase Dashboard'dan alın:
// 1. Project Settings → API → Project URL
// 2. Project Settings → API → Project API keys → anon public
const supabaseUrl = 'YOUR_SUPABASE_URL' // örn: https://abcdefgh.supabase.co
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY' // anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper fonksiyonları
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Database helper fonksiyonları
export const getPlatformData = async () => {
  const { data, error } = await supabase
    .from('platform_data')
    .select('*')
    .order('entered_at', { ascending: false })
  return { data, error }
}

export const addPlatformData = async (platformData: any) => {
  const { data, error } = await supabase
    .from('platform_data')
    .insert([{
      platform: platformData.platform,
      metrics_followers: platformData.metrics.followers,
      metrics_engagement: platformData.metrics.engagement,
      metrics_reach: platformData.metrics.reach,
      metrics_impressions: platformData.metrics.impressions,
      metrics_clicks: platformData.metrics.clicks,
      metrics_conversions: platformData.metrics.conversions,
      month: platformData.month,
      year: platformData.year,
      entered_by: platformData.enteredBy,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
  return { data, error }
}

export const getWebsiteData = async () => {
  const { data, error } = await supabase
    .from('website_data')
    .select('*')
    .order('entered_at', { ascending: false })
  return { data, error }
}

export const addWebsiteData = async (websiteData: any) => {
  const { data, error } = await supabase
    .from('website_data')
    .insert([{
      visitors: websiteData.visitors,
      page_views: websiteData.pageViews,
      bounce_rate: websiteData.bounceRate,
      avg_session_duration: websiteData.avgSessionDuration,
      conversions: websiteData.conversions,
      top_pages: websiteData.topPages,
      month: websiteData.month,
      year: websiteData.year,
      entered_by: websiteData.enteredBy,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
  return { data, error }
}

export const getNewsData = async () => {
  const { data, error } = await supabase
    .from('news_data')
    .select('*')
    .order('entered_at', { ascending: false })
  return { data, error }
}

export const addNewsData = async (newsData: any) => {
  const { data, error } = await supabase
    .from('news_data')
    .insert([{
      mentions: newsData.mentions,
      sentiment: newsData.sentiment,
      reach: newsData.reach,
      top_sources: newsData.topSources,
      month: newsData.month,
      year: newsData.year,
      entered_by: newsData.enteredBy,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }])
  return { data, error }
}

// Real-time subscriptions
export const subscribeToPlatformData = (callback: (payload: any) => void) => {
  return supabase
    .channel('platform_data_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'platform_data' }, 
      callback
    )
    .subscribe()
}

export const subscribeToWebsiteData = (callback: (payload: any) => void) => {
  return supabase
    .channel('website_data_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'website_data' }, 
      callback
    )
    .subscribe()
}

export const subscribeToNewsData = (callback: (payload: any) => void) => {
  return supabase
    .channel('news_data_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'news_data' }, 
      callback
    )
    .subscribe()
} 