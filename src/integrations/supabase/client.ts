
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://beafvyqruftkpcuuxmwt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYWZ2eXFydWZ0a3BjdXV4bXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTkwODcsImV4cCI6MjA2MjkzNTA4N30.OhezGqnJWME8rI-tMoVX-XO73eU3pHjwTftiTydoef4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
