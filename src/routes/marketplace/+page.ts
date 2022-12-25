import type { PageLoad } from "./$types";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async (event) => {
  const { session, supabaseClient } = await getSupabase(event);
  if (!session) {
    throw redirect(303, "/auth");
  }
  let businesses: any[] = [];

  {
    const { data } = await supabaseClient
      .from("businesses")
      .select("id, title, description, mainImage, category");

    if (data) businesses = data;
  }

  return {
    user: session.user,
    businesses: businesses,
  };
};
