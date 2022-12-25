<script lang="ts">
  import { DateTime, Info, SystemZone } from "luxon";
  import supabase from "$lib/db";
  import { goto } from "$app/navigation";
  import Calendar from "$lib/components/Calendar.svelte";
  import { json } from "@sveltejs/kit";
  import Toggle from "$lib/components/Toggle.svelte";

  export let data: any;
  $: ({ user, business } = data);

  let title: string = "";
  let description: string = "";
  let price: number = 0;
  let monetization: boolean = true;
  let sessionLength: number = 0;
  let location: string = "";
  let category: string = "";
  let paymentForms: { name: string; enabled: boolean }[] = [
    { name: "Cash", enabled: false },
    { name: "Card", enabled: false },
  ];
  let timeSlots: {
    day: string;
    slots: { start: string; end: string }[];
    enabled: boolean;
  }[] = [
    {
      day: "Monday",
      slots: [],
      enabled: false,
    },
    {
      day: "Tuesday",
      slots: [],
      enabled: false,
    },
    {
      day: "Wednesday",
      slots: [],
      enabled: false,
    },
    {
      day: "Thursday",
      slots: [],
      enabled: false,
    },
    {
      day: "Friday",
      slots: [],
      enabled: false,
    },
    {
      day: "Saturday",
      slots: [],
      enabled: false,
    },
    {
      day: "Sunday",
      slots: [],
      enabled: false,
    },
  ];
  let specificDates: {
    date: string;
    slots: { start: string; end: string }[];
  }[] = [];

  let overlapError: boolean = false;

  $: checkOverlap(timeSlots);

  async function createService() {
    const { data, error } = await supabase.from("services").insert([
      {
        title,
        description,
        price,
        monetization,
        session_length: sessionLength,
        location,
        category,
        owner_id: user?.id,
        business_id: business?.id,
        payment_forms: paymentForms,
        time_slots: timeSlots,
        specific_dates: specificDates,
      },
    ]);
    if (error) {
      throw error;
    } else {
      goto("/dashboard/business");
    }
  }

  function checkOverlap(timeSlots: any) {
    overlapError = false;
    timeSlots.forEach((day: any) => {
      if (day.enabled) {
        for (let i = 0; i < day.slots.length; i++) {
          const start = DateTime.fromFormat(
            day.slots[i].start,
            "HH:mm"
          ).setZone("America/Los_Angeles");
          const end = DateTime.fromFormat(day.slots[i].end, "HH:mm").setZone(
            "America/Los_Angeles"
          );
          if (start > end) {
            overlapError = true;
            return;
          }
          if (day.slots[i + 1] !== undefined) {
            const nextStart = DateTime.fromFormat(
              day.slots[i + 1].start,
              "HH:mm"
            ).setZone("America/Los_Angeles");
            if (end > nextStart) {
              overlapError = true;
              return;
            }
          }
        }
      }
    });
  }
</script>

<div class="flex flex-col bg-white w-10/12 mx-auto p-5 rounded-lg">
  <h1 class="font-semibold text-lg">Create Service</h1>
  <div class="flex flex-col gap-2">
    <label for="title">Title</label>
    <input
      type="text"
      id="title"
      bind:value={title}
      class="border border-gray-300 rounded-[5px] p-1"
    />
  </div>
  <div class="flex flex-col gap-2">
    <label for="description">Description</label>
    <textarea
      id="description"
      bind:value={description}
      class="border border-gray-300 rounded-[5px] p-1"
    />
  </div>
  <div class="flex flex-col gap-2">
    <label for="price">Price</label>
    <input
      type="number"
      id="price"
      bind:value={price}
      class="border border-gray-300 rounded-[5px] p-1"
    />
  </div>
  <div class="flex flex-col gap-2">
    <label for="monetization">Monetization</label>
    <select
      id="monetization"
      bind:value={monetization}
      class="border border-gray-300 rounded-[5px] p-1"
    >
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  </div>
  <div class="flex flex-col gap-2">
    <label for="sessionLength">Session Length</label>
    <input
      type="number"
      id="sessionLength"
      bind:value={sessionLength}
      class="border border-gray-300 rounded-[5px] p-1"
    />
  </div>
  <div class="flex flex-col gap-2">
    <label for="location">Location</label>
    <input
      type="text"
      id="location"
      bind:value={location}
      class="border border-gray-300 rounded-[5px] p-1"
    />
  </div>
  <div class="flex flex-col gap-2">
    <label for="category">Category</label>
    <input
      type="text"
      id="category"
      bind:value={category}
      class="border border-gray-300 rounded-[5px] p-1"
    />
  </div>
  <div class="flex flex-col gap-2">
    <label for="paymentForms">Payment Forms</label>
    <div class="flex flex-col gap-2">
      {#each paymentForms as paymentForm}
        <div class="flex flex-row gap-2">
          <Toggle
            check={paymentForm.enabled}
            on:toggle={() => (paymentForm.enabled = !paymentForm.enabled)}
          />

          <label for="paymentForm.name">{paymentForm.name}</label>
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2 w-full ">
    <label for="timeSlots">Time Slots</label>
    <div class="flex flex-col gap-2">
      {#if overlapError}
        <div class="flex flex-row gap-2">
          <p class="text-red-500">Time slots overlap</p>
        </div>
      {/if}
      {#each timeSlots as timeSlot}
        <div class="flex flex-row gap-2 items-center">
          <Toggle
            check={timeSlot.enabled}
            on:toggle={() => (timeSlot.enabled = !timeSlot.enabled)}
          />
          <label for="timeSlot.day">{timeSlot.day}</label>
        </div>
        {#if timeSlot.enabled}
          <div class="flex flex-col gap-2">
            {#each timeSlot.slots as slot (slot)}
              <div class="flex flex-row gap-2">
                <input
                  type="time"
                  bind:value={slot.start}
                  class="border border-gray-300 rounded-[5px] p-1"
                />
                <input
                  type="time"
                  bind:value={slot.end}
                  class="border border-gray-300 rounded-[5px] p-1"
                />
                <button
                  on:click={() => {
                    timeSlot.slots = timeSlot.slots.filter((s) => s !== slot);
                  }}
                  class="w-fit p-1 bg-red-500 hover:bg-red-400 rounded-lg text-white"
                  >Delete</button
                >
              </div>
            {/each}
          </div>
          {#if !overlapError}
            <button
              on:click={() =>
                (timeSlot.slots = [...timeSlot.slots, { start: "", end: "" }])}
              class="w-full p-1 bg-green-500 hover:bg-green-400 rounded-lg text-white"
              >Add Slot</button
            >
          {:else}
            <button
              on:click={() =>
                (timeSlot.slots = [...timeSlot.slots, { start: "", end: "" }])}
              class="w-full p-1 border-[1px] border-green-400 rounded-lg text-black"
              disabled>Add Slot</button
            >
          {/if}
        {/if}
      {/each}
    </div>
  </div>

  <div class="w-11/12 h-fit mx-auto my-8">
    <h1 class="text-lg font-medium">Add Specifc Dates</h1>
    <Calendar
      on:date={(event) => {
        const index = specificDates.findIndex(
          (date) => date.date === event.detail.JSON.date
        );
        if (index !== -1) {
          specificDates[index] = event.detail.JSON;
        } else {
          specificDates = [...specificDates, event.detail.JSON];
        }
      }}
      {specificDates}
    />
  </div>
  <div class="flex flex-row gap-1">
    <button
      on:click={() => goto("/dashboard/business")}
      class="w-full p-1 bg-red-500 hover:bg-red-400 rounded-lg text-white"
      >Cancel</button
    >
    {#if !overlapError}
      <button
        on:click={createService}
        class="w-full p-1 bg-green-500 hover:bg-green-400 rounded-lg text-white"
        >Create</button
      >
    {:else}
      <button
        class="w-full p-1
        bg-green-500
        hover:bg-green-400
        rounded-lg
        text-white
        cursor-not-allowed
        opacity-50"
        disabled>Create</button
      >
    {/if}
  </div>
</div>
