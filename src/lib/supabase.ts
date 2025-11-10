// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { ENV } from './env';

export const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON);
