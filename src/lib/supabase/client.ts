import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './types'

// Browser-side Supabase client
export const createClient = () => createClientComponentClient<Database>()

// Export singleton client for components
export const supabase = createClient() 