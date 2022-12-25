import type { PageLoad } from "./$types";
import { getSupabase } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async (event) => {
  const { session, supabaseClient } = await getSupabase(event);
  const { id } = event.params;
  // if (!session) {
  //   throw redirect(303, "/auth");
  // }
  let business: any;
  let services: any[] = [];

  {
    const { data } = await supabaseClient
      .from("businesses")
      .select()
      .eq("id", id);

    if (data) business = data[0];
  }
  {
    const { data } = await supabaseClient
      .from("services")
      .select()
      .eq("business_id", id);

    if (data) services = data;
  }

  return {
    user: session?.user,
    business: business,
    services: services,
  };
};
