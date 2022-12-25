<script lang="ts">
  import Dropdown from "$lib/components/Dropdown.svelte";
  import supabase from "$lib/db";
  export let data: any;
  $: ({ user, business } = data);

  let services: any = [];
  let bookings: any = [];
  let loading: boolean = true;

  async function loadData() {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", business.id);
      if (error) {
        console.log(error);
      } else {
        services = data;
      }
      {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("business_id", business.id);
        if (error) {
          console.log(error);
        } else {
          bookings = data;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading = false;
    }
  }

  $: if (user && business && loading) {
    loadData();
  }
</script>


{#if !loading}
  <div class="flex flex-col w-full">
    {#each services as service}
      <div class="w-full bg-slate-100 rounded-lg p-5">
        <h1 class="font-medium first-letter:uppercase">{service.title}</h1>
        <h2>Schedule</h2>
        <div class="flex flex-col gap-5">
          {#each service.time_slots as slot}
            <div class="flex flex-row gap-5">
              {#if slot.slots.length > 0}
                <h1>{slot.day}</h1>
                {#each slot.slots as time}
                  <div class="flex flex-row gap-5">
                    <h3>{time.start}</h3>
                    <h3>{time.end}</h3>
                  </div>
                {/each}
              {/if}
            </div>
            <!-- {#each slot.times as time}
                <p>{time.start}</p>
              {/each} -->
          {/each}
        </div>
        <h2>Bookings</h2>
        {#if bookings.length > 0}
          {#each bookings as booking}
            {#if booking.service_id === service.id}
              <p>{booking.title}</p>
            {/if}
          {/each}
        {:else}
          <p>No bookings</p>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <div class="flex flex-col justify-center items-center w-full h-screen">
    <p class="animate-bounce">Loading</p>
  </div>
{/if}
