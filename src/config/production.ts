// Production Configuration
export const productionConfig = {
  supabase: {
    url: 'https://nrgvbfgiaksyagaznyhx.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZ3ZiZmdpYWtzeWFnYXpueWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjQ4ODUsImV4cCI6MjA2NzQwMDg4NX0.eJBJ85fkxiIWSOyOU8GwF6UTgukor9K2zBsXLCLm5PU'
  },
  app: {
    name: 'ReportHub',
    version: '1.0.0',
    environment: 'production',
    baseUrl: 'https://kim-rapor.vercel.app'
  },
  features: {
    enableDemoMode: true,
    enableAuthRegistration: true,
    enableRPAReports: true,
    enableRealTimeUpdates: true,
    enableErrorTracking: true
  },
  ui: {
    showVersionInfo: false,
    enableDevTools: false,
    showDebugInfo: false
  },
  deployment: {
    platform: 'vercel',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    nodeVersion: '18.x'
  }
}; 