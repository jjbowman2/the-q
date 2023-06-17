<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/utils/clickOutside';
	import { Pencil, Save, Trash } from 'lucide-svelte';
	import { anonymousAuthToken } from '$lib/stores/anonymousAuthStore';
	export let label: string;
	export let gameId: string;
	export let playerId: string | null = null;
	let editing = false;
	let value = '';
</script>

{#if editing}
	<form
		method="post"
		action={playerId ? '?/renamePlayer' : '?/joinGame'}
		use:enhance={() =>
			async ({ result, update }) => {
				if (result.type == 'success') {
					editing = false;
				}
				await update();
			}}
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
		<input hidden name="player-id" value={playerId} />
		<input hidden name="created_by_anon" value={$anonymousAuthToken} />

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
	<div class="flex gap-3">
		<button type="button" class="flex gap-2 items-center group" on:click={() => (editing = true)}>
			<p class="text-gray-400 group-hover:text-gray-700 italic">{label}</p>
			<Pencil class="text-gray-400 h-4 group-hover:text-gray-700" />
		</button>
		{#if playerId}
			<form method="post" action="?/leaveGame" use:enhance class="flex items-center">
				<input hidden name="player-id" value={playerId} />
				<button type="submit" class="group">
					<Trash class="h-4 text-gray-400 group-hover:text-gray-600 group-active:scale-95" />
				</button>
			</form>
		{/if}
	</div>
{/if}
