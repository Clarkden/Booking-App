import type { PageLoad } from "./$types";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";

export const load: PageLoad = async (event) => {
  const { supabaseClient } = await getSupabase(event);
  await supabaseClient.auth.signOut();
};
