<script lang="ts">
	const COLORS = ['#FB7185', '#93C5FD', '#A78BFA', '#34D399'];
	import type { Database } from '../../types/supabase';
	import Accordion from './Accordion/Accordion.svelte';
	import AccordionContent from './Accordion/AccordionContent.svelte';
	import AccordionHeader from './Accordion/AccordionHeader.svelte';
	import Paddle from './Paddle.svelte';
	import { enhance } from '$app/forms';
	import EditableText from './EditableText.svelte';
	import { anonymousAuthToken } from '$lib/stores/anonymousAuthStore';
	import type { User } from '@supabase/supabase-js';
	type Game = Database['public']['Tables']['games']['Row'];
	type Player = Database['public']['Tables']['players']['Row'];
	type GameWithPlayers = Game & { players: Player | Player[] | null };
	export let game: GameWithPlayers;
	export let index: number;
	export let user: User | undefined;
	$: isCurrentUsersGame =
		(game.created_by !== null && game.created_by === user?.id) ||
		(game.created_by == null && game.created_by_anon === $anonymousAuthToken);
	const playerWasAddedByUser = (player: Player) =>
		(player.created_by !== null && player.created_by === user?.id) ||
		(player.created_by == null && player.created_by_anon === $anonymousAuthToken);
	function hashUUID(uuid: string): number {
		let hash = 0;
		for (let i = 0; i < uuid.length; i++) {
			const character = uuid.charCodeAt(i);
			hash = (hash << 5) - hash + character;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	function uuidToIndex(uuid: string, arrayLength: number): number {
		const hash = hashUUID(uuid);
		return Math.abs(hash) % arrayLength;
	}

	// assign a random color to each game
	let fill = COLORS[uuidToIndex(game.id, COLORS.length)];
	$: gameSize = game.game_size ?? 4;
	$: players = Array.isArray(game?.players) ? game.players : game?.players ? [game.players] : [];
	$: playerCount = players.length;
	$: sortedPlayers =
		players.sort((a, b) => Date.parse(a.created_at ?? '0') - Date.parse(b.created_at ?? '0')) ?? [];
</script>

<Accordion>
	<AccordionHeader>
		<div class="flex gap-2 items-center">
			<Paddle {fill} number={index + 1} />
			<p class="font-semibold">
				{playerCount} / {game.game_size} players {isCurrentUsersGame ? ' (You)' : ''}
			</p>
		</div>
		<!-- TODO: Quick Actions -->
	</AccordionHeader>
	<AccordionContent>
		<div class="flex justify-between p-4">
			<div class="flex flex-col gap-1">
				{#each sortedPlayers as player (player.id)}
					{#if playerWasAddedByUser(player)}
						<EditableText gameId={game.id} playerId={player.id} label={player.player_name} />
					{:else}
						<p class="text-gray-600">{player.player_name}</p>
					{/if}
				{/each}
				{#each Array(gameSize - playerCount) as _, i (i + playerCount)}
					<EditableText gameId={game.id} label="Open" />
				{/each}
			</div>
			<div class="flex flex-col gap-3">
				{#if isCurrentUsersGame}
					<form method="post" action="?/deleteGame" use:enhance class="text-right">
						<input type="hidden" name="game-id" value={game.id} />
						<button class="font-semibold text-emerald-600 active:scale-95 hover:text-emerald-700"
							>Start Game</button
						>
					</form>
					<!-- <button class="font-semibold text-gray-600 active:scale-95 hover:text-gray-700 text-right"
						>Manage Players</button
					> -->
					<form method="post" action="?/delayGame" use:enhance class="text-right">
						<input type="hidden" name="game-id" value={game.id} />
						<input type="hidden" name="created-at" value={game.created_at} />
						<button class="font-semibold text-gray-600 active:scale-95 hover:text-gray-700"
							>Not Ready</button
						>
					</form>
					<form method="post" action="?/deleteGame" use:enhance class="text-right">
						<input type="hidden" name="game-id" value={game.id} />
						<button class="font-semibold text-red-600 active:scale-95 hover:text-red-700"
							>Leave Queue</button
						>
					</form>
					<!-- {:else}
					<button class="font-semibold text-red-600 active:scale-95 hover:text-red-700 text-right"
						>Report</button
					> -->
				{/if}
			</div>
		</div>
	</AccordionContent>
</Accordion>
