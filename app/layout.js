import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Calorie Deficit AI - Health Tracker',
  description: 'Aplikasi kesehatan cerdas dengan AI Personal Trainer dan Analytics',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Google Auth Config */}
        <meta name="google-signin-client_id" content="329300608269-tpv1dff78acj6j0avi07872u0kvgkhn1.apps.googleusercontent.com" />
        
        {/* CSS Files - ORDER MATTERS! */}
        <link rel="stylesheet" href="/index.css" />
        <link rel="stylesheet" href="/registration-styles.css" />
        <link rel="stylesheet" href="/registration-progress-enhanced.css" />
        <link rel="stylesheet" href="/login-daftar-sekarang.css" />
        {/* ⭐ Complete Profile Form - Clean Layout */}
        <link rel="stylesheet" href="/complete-profile-form.css" />
        {/* ⭐ LOAD LAST - This overrides all above */}
        <link rel="stylesheet" href="/registration-steps-responsive.css" />
      </head>
      <body suppressHydrationWarning={true}>
        {/* External Libraries - Load BEFORE page content */}
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
          strategy="beforeInteractive"
        />
        
        {/* ===== SUPABASE SYSTEM ===== */}
        {/* 1. Supabase Integration (init client) */}
        <Script 
          src="/supabase-integration.js" 
          strategy="afterInteractive"
        />
        
        {/* 2. Google Sign-In Handler (with Supabase check) */}
        <Script 
          src="/google-signin-handler.js" 
          strategy="afterInteractive" 
        />

        {/* 3. Supabase Login System (FIXED - handles RLS) */}
        <Script 
          src="/supabase-login.js" 
          strategy="afterInteractive"
        />
        
        {/* 3.5. Supabase Login Debug (ENHANCED - replaces original login) */}
        <Script 
          src="/supabase-login-debug.js" 
          strategy="afterInteractive"
        />
        
        {/* 3.6. Auto-Set Password for Google Users */}
        <Script 
          src="/auto-set-password-google.js" 
          strategy="afterInteractive"
        />
        
        {/* 3.7. Forgot Password Feature */}
        <Script 
          src="/forgot-password.js" 
          strategy="afterInteractive"
        />
        
        {/* 4. Complete Profile All Validations (Password + Nomor WA) */}
        <Script 
          src="/complete-profile-all-validation.js" 
          strategy="afterInteractive"
        />
        
        {/* 5. Force Progress Update - ONLY for Registration Form (skip Complete Profile) */}
        <Script 
          src="/force-progress-update.js" 
          strategy="afterInteractive"
        />
        
        {/* ⭐ 6. Enhanced Registration Progress System */}
        <Script 
          src="/registration-progress-enhanced.js" 
          strategy="afterInteractive"
        />
        
        {/* ⭐ Complete Profile Progress & Validation (completion-based) */}
        {/* NOTE: complete-profile-auto-highlight.js di-load dari page.js */}

        {/* ⭐ 7. Supabase Activity Sync v3.1 (with session check) */}
        <Script 
          src="/supabase-activity-sync.js" 
          strategy="afterInteractive"
        />
        
        {/* ⭐ 7.5. Google User Activity Sync (handles Google login users) */}
        <Script 
          src="/supabase-login-google.js" 
          strategy="afterInteractive"
        />
        
        {/* ⭐ 8. Input Harian Handler (handles save from Input Harian page) */}
        <Script 
          src="/input-harian-handler.js" 
          strategy="afterInteractive"
        />
        {/* ============== */}
        
        {children}
      </body>
    </html>
  );
}