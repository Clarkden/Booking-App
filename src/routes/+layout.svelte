<script>
  import { invalidate } from "$app/navigation";
  import supabase from "$lib/db";
  import { onMount } from "svelte";
  import "../app.css";

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate("supabase:auth");
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div class="bg-gradient-to-r from-emerald-100 to-sky-100 min-h-screen">
  <slot />
</div>
