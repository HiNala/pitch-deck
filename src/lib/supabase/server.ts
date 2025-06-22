import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types'

// Server component client
export const createServerClient = () => 
  createServerComponentClient<Database>({ cookies })

// Route handler client
export const createRouteClient = () => 
  createRouteHandlerClient<Database>({ cookies }) 