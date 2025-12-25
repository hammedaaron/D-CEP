
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

// Established connection to user's project
const supabaseUrl = 'https://kwbtuuytoqpxxqzxbtec.supabase.co';
const supabaseKey = 'sb_publishable_6NlP3cr6uksSspRNrFPuRQ_ctTuPqVs';

export const supabase = createClient(supabaseUrl, supabaseKey);
