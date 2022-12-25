<script lang="ts">
  import { DateTime, Info } from "luxon";
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let specificDates: any = [];

  let dateModal: boolean = false;
  let modalDate: string = "";
  let modalSlots: { start: string; end: string }[] = [];

  $: if (dateModal) {
    const index = specificDates.findIndex(
      (date: any) => date.date === modalDate
    );
    if (index !== -1) {
      modalSlots = specificDates[index].slots;
    }
  }

  let date = DateTime.now().setZone("America/Los_Angeles");
  $: daysInMonth = date.daysInMonth;
  $: checkOverlap(modalSlots);
  let overlapError: boolean = false;

  function addDate() {
    dispatch("date", {
      JSON: {
        date: modalDate,
        slots: modalSlots,
      },
    });
    dateModal = false;
    modalDate = "";
    modalSlots = [];
  }

  function checkOverlap(modalSlots: any) {
    overlapError = false;
    for (let i = 0; i < modalSlots.length; i++) {
      const start = DateTime.fromFormat(modalSlots[i].start, "HH:mm").setZone(
        "America/Los_Angeles"
      );
      const end = DateTime.fromFormat(modalSlots[i].end, "HH:mm").setZone(
        "America/Los_Angeles"
      );
      if (start > end) {
        overlapError = true;
        return;
      }
      if (modalSlots[i + 1] !== undefined) {
        const nextStart = DateTime.fromFormat(
          modalSlots[i + 1].start,
          "HH:mm"
        ).setZone("America/Los_Angeles");
        if (end > nextStart) {
          overlapError = true;
          return;
        }
      }
    }
  }
</script>

<div class="flex flex-col w-full h-full relative">
  {#if dateModal}
    <div
      class="absolute bg-black/25 flex flex-col items-center justify-center w-full h-full  z-30"
    >
      <div
        class="bg-white w-[60%] h-[50%] rounded-lg p-5 flex flex-col justify-between"
      >
        <div>
          <div class="flex flex-row w-full items-center justify-between">
            <h1>{modalDate.toLocaleString()}</h1>
            <button
              on:click={() => {
                modalDate = "";
                (modalSlots = []), (dateModal = false);
              }}
              class="text-red-400"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="flex flex-col gap-2">
            {#each modalSlots as slot, i (i)}
              <div class="flex flex-row gap-2">
                <input type="time" bind:value={slot.start} />
                <input type="time" bind:value={slot.end} />
                <button
                  on:click={() => {
                    modalSlots = modalSlots.filter((_, index) => index !== i);
                  }}
                >
                  Remove
                </button>
              </div>
            {/each}
          </div>
          {#if overlapError}
            <p>Overlapping times</p>
          {/if}
          <button
            on:click={() => {
              modalSlots = [...modalSlots, { start: "", end: "" }];
            }}
            class="flex flex-row gap-2 0 p-1 rounded-lg text-emerald-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Time Slot
          </button>
        </div>
        <div>
          <button class="bg-emerald-300 p-1 rounded-md" on:click={addDate}>
            Save Date
          </button>
        </div>
      </div>
    </div>
  {/if}
  <div class="flex flex-row justify-between">
    <div>
      <h1 class="font-medium text-lg">Calendar</h1>
      <div class="flex flex-row gap-2">
        <button
          class="hover:text-emerald-400"
          on:click={() => (date = date.minus({ months: 1 }))}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <p>{date.monthLong} {date.year}</p>
        <button
          class="hover:text-emerald-400"
          on:click={() => (date = date.plus({ months: 1 }))}
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>

    {#if specificDates.length > 0}
    <div
    class="flex flex-col gap-1 bg-slate-100 rounded-lg w-fit p-2 h-fit items-start"
    >
    <h1 class="pb-1 w-fit font-medium">Specific Dates</h1>
        {#each specificDates as date (date)}
          <div class="flex flex-row w-full gap-4 h-[30px] items-center">
            <p>{date.date.toLocaleString()}</p>
            <div class="flex flex-row gap-4 items-center">
              <button
                on:click={() => {
                  specificDates = specificDates.filter((d) => d !== date);
                }}
                class="w-fit h-fit text-red-400 hover:text-red-500 rounded-lg text-lg"
                >Delete</button
              >
              <button
                on:click={() => {
                  dateModal = true;
                  modalDate = date.date.toLocaleString();
                  modalSlots = date.slots;
                }}
                class="w-fit h-fit text-emerald-400 hover:text-emerald-400 rounded-lg text-lg"
                >Edit</button
              >
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="flex flex-row flex-wrap gap-1">
    {#each Info.weekdays("short", { locale: "us" }) as day (day)}
      <div class="col-span-1 w-1/7"><p class="">{day}</p></div>
    {/each}
    {#each Array(daysInMonth) as day, i}
      <div
        class={`flex flex-col h-[14vh] w-[13.5%] text-black rounded-lg p-1 drop-shadow-md transition  ${
          DateTime.local(date.year, date.month, i + 1) <
          DateTime.now().startOf("day")
            ? "bg-gray-300 pointer-events-none"
            : "bg-emerald-300 hover:bg-emerald-200 cursor-pointer"
        }`}
        on:mousedown={() => {
          dateModal = true;
          modalDate = DateTime.local(date.year, date.month, i + 1)
            .setZone("America/Los_Angeles")
            .toLocaleString();
        }}
      >
        <div class="col-span-1">
          <p class="w-fit drop-shadow-md">{i + 1}</p>
        </div>
      </div>
    {/each}
  </div>
</div>
