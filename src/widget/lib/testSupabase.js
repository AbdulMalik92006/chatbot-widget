import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoiquwtvnpxnlssqadyz.supabase.co';
const supabasePublishableKey = 'sb_publishable_EodTzOIXYY0kPOGDxfwYzw_fZOUFcf6';

const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export async function getCompanySettings(companyId) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error) {
    console.error('Failed to load company settings:', error);
    return null;
  }

  console.log('Company configuration:', data);

  return data;
}