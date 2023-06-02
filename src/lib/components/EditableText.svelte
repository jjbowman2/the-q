<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { Pencil, Save } from 'lucide-svelte';
	export let label: string;
	export let gameId: string;
	let editing = false;
	let value = '';
</script>

{#if editing}
	<form
		method="post"
		action="?/joinGame"
		use:enhance
		use:clickOutside
		on:clickoutside={() => (editing = false)}
		on:keydown={(e) => {
			if (e.key === 'Escape') {
				editing = false;
			}
		}}
		class="flex gap-2 items-center"
	>
		<input hidden name="game-id" value={gameId} />
		<!-- svelte-ignore a11y-autofocus -->
		<input
			name="player-name"
			autocomplete="off"
			type="text"
			bind:value
			autofocus
			required
			class="border-b border-gray-300 focus-visible:border-gray-400 px-1 focus-visible:outline-none w-32"
		/>
		<button type="submit" class="group">
			<Save class="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-active:scale-95" />
		</button>
	</form>
{:else}
	<button type="button" class="flex gap-2 items-center group" on:click={() => (editing = true)}>
		<p class="text-gray-400 group-hover:text-gray-700 italic">{label}</p>
		<Pencil class="text-gray-400 w-4 h-4 group-hover:text-gray-700" />
	</button>
{/if}
