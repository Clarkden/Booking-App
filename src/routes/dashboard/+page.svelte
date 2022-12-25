<script lang="ts">
  export let data: any;
  $: ({ user, business } = data);
  const greetings = [
    "Welcome",
    "Wlecome back",
    "Hello",
    "Howdy",
    "Hi",
    "Hey",
    "What's up",
  ];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
</script>

<div class="w-full md:px-20 flex flex-col gap-5">
  <h1 class="font-bold text-3xl">
    <span class="text-emerald-400">{greeting}</span>
    {user.user_metadata.name}
  </h1>
  <div
    class="drop-shadow-lg w-full h-fit bg-white rounded-lg p-2 flex flex-col gap-2"
  >
    <h1 class="font-semibold text-base">Your Business at a Glance</h1>
    {#if business}
      <a
        href="/dashboard/business"
        class="bg-emerald-400 hover:bg-emerald-500 text-white p-1 rounded-[5px]"
        >Mangage Your Business</a
      >
    {:else}
      <a
        href="/dashboard/business/create"
        class="bg-emerald-400 hover:bg-emerald-500 text-white p-1 rounded-[5px]"
        >Create Your Business</a
      >
    {/if}
  </div>
</div>
