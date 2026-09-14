import { createClient } from '@supabase/supabase-js' 

const supabaseUrl = 'https://yoiquwtvnpxnlssqadyz.supabase.co' 

const supabaseAnonKey = 'sb_publishable_EodTzOIXYY0kPOGDxfwYzw_fZOUFcf6' 

export const supabase = createClient( supabaseUrl, supabaseAnonKey )