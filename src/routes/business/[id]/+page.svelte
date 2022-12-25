<script lang="ts">
  import Navbar from "../../../lib/components/Navbar.svelte";
  import supabase from "$lib/db";
  export let data: any;
  $: ({ user, business, services } = data);
</script>

<div class="md:px-10 pt-5">
  <Navbar data={data} />
  <div class="grid grid-cols-8 grid-flow-row gap-5">
    <div class="col-span-4 flex flex-col bg-white rounded-lg p-5">
      <h1 class="font-bold text-xl">{business.name}</h1>
      <p>{business.description}</p>

      <h1 class="font-medium text-lg">Services</h1>
      {#if services.length > 0}
        <p>Services</p>
        <div class="flex flex-col gap-2">
          {#each services as service (service.id)}
            <div class="flex flex-row gap-2">
              <div class="w-[32px] h-[32px] bg-gray-400 rounded-full" />
              <div class="flex flex-col">
                <h1>{service.title}</h1>
                <p>{service.description}</p>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="col-span-4">
      <div class="w-full h-[60vh] overflow-hidden relative rounded-lg">
        <img
          src={business.coverImage}
          alt={business.title}
          class="min-h-full absolute top-[-9999px] bottom-[-9999px] left-[-9999px] right-[-9999px] m-auto rounded-lg"
        />
      </div>
    </div>
  </div>
</div>
