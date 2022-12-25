<script lang="ts">
  import Calendar from "$lib/components/Calendar.svelte";
  import { onMount } from "svelte";
  import supabase from "$lib/db";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import Schedule from "$lib/components/Schedule.svelte";

  export let data: any;
  $: ({ user } = data);

  let services: any;
  let business: any = null;
  let loading: boolean = true;

  async function loadData() {
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (error) console.log(error);

      if (data) {
        console.log(JSON.stringify(data));
        business = data;
      }

      if (business) {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("business_id", business.id);

        if (error) console.log(error);

        if (data) {
          services = data;
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

  onMount(() => {
    loadData();
  });
</script>

<div class="flex flex-col gap-5 w-10/12 mx-auto">
  {#if loading}
    <div class="flex flex-col justify-center items-center w-full h-screen">
      <p class="animate-bounce">Loading</p>
    </div>
  {:else}
    <div class="flex flex-col gap-5">
      {#if business}
        <div
          class="p-5 bg-white w-full h-fit rounded-[10px] grid grid-cols-8 grid-flow-row"
        >
          <div class="col-span-4">
            <h2 class="font-semibold text-lg">Your Business</h2>
          </div>
          <div class="col-span-4 flex items-center justify-end">
            <Dropdown
              data={[
                {
                  title: "Manage",
                  destination: "/dashboard/business/manage",
                },
                ,
              ]}
            />
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            <h1 class="text-base">Business</h1>
            <h2 class="font-medium text-base">{business.name}</h2>
          </div>
          <div class="col-span-2 flex flex-col justify-center">
            <h2 class="text-base">Bookings</h2>
            <h3 class="font-medium text-base">0</h3>
          </div>
        </div>
        <div
          class="p-5 bg-white w-full h-fit rounded-[10px] grid grid-cols-8 grid-flow-row"
        >
          <div class="col-span-4">
            <h2 class="font-semibold text-lg ">Your Services</h2>
          </div>
          {#if services.length < 1}
            <div class="col-span-8">
              <h2 class="text-base">You don't have any services yet</h2>
              <a
                href="/dashboard/business/create/service"
                class="hover:text-emerald-400">Create Service</a
              >
            </div>
          {:else}
            <div class="col-span-4 flex items-center justify-end">
              <Dropdown
                data={[
                  {
                    title: "Manage",
                    destination: "/dashboard/business/manage/services",
                  },
                ]}
              />
            </div>
            {#each services as service}
              <div class="col-span-2 flex flex-col justify-center">
                <h1 class="text-base">Service</h1>
                <h2 class="font-medium text-base">{service.title}</h2>
              </div>
              <div class="col-span-2 flex flex-col justify-center">
                <h2 class="text-base">Bookings</h2>
                <h3 class="font-medium text-base">0</h3>
              </div>
            {/each}
          {/if}
        </div>
        <div
          class="p-5 bg-white w-full h-fit rounded-[10px] grid grid-cols-8 grid-flow-row"
        >
          Bookings
        </div>
        <div class="p-5 bg-white w-full h-fit rounded-[10px] flex flex-col">
          <Schedule />
        </div>
      {/if}
      {#if business === null}
        <div class="col-span-8 bg-white p-5 rounded-lg">
          <h2 class="font-semibold text-xl">You don't have a business yet</h2>
          <a href="/dashboard/business/create" class="hover:text-emerald-400">
            Create a Business</a
          >
        </div>
      {/if}
    </div>
  {/if}
</div>
