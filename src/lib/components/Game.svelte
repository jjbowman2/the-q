<script lang="ts">
	const COLORS = ['#FB7185', '#93C5FD', '#A78BFA', '#34D399'];
	import type { Database } from '../../types/supabase';
	import { Pencil } from 'lucide-svelte';
	import Accordion from './Accordion/Accordion.svelte';
	import AccordionContent from './Accordion/AccordionContent.svelte';
	import AccordionHeader from './Accordion/AccordionHeader.svelte';
	import Paddle from './Paddle.svelte';
	type Game = Database['public']['Tables']['games']['Row'];
	export let game: Game;
	export let index: number;
	export let isCurrentUsersGame: boolean;
	// assign a random color to each game
	let fill = COLORS[Math.floor(Math.random() * COLORS.length)];
</script>

<Accordion>
	<AccordionHeader>
		<div class="flex gap-2 items-center">
			<Paddle {fill} number={index + 1} />
			<p class="font-semibold">
				{game.players.length} / {game.game_size} players {isCurrentUsersGame ? ' (You)' : ''}
			</p>
		</div>
		<!-- TODO: Quick Actions -->
	</AccordionHeader>
	<AccordionContent>
		<div class="flex justify-between p-4">
			<div class="flex flex-col gap-1">
				{#each game.players as player}
					<p class="text-gray-600">{player}</p>
				{/each}
				{#each Array(game.game_size - game.players.length) as _}
					<button type="button" class="flex gap-2 items-center group">
						<p class="text-gray-400 group-hover:text-gray-700">Open</p>
						<Pencil class="text-gray-400 w-4 h-4 group-hover:text-gray-700" />
					</button>
				{/each}
			</div>
			<div class="flex flex-col gap-3">
				{#if isCurrentUsersGame}
					<button
						class="font-semibold text-emerald-600 active:scale-95 hover:text-emerald-700 text-right"
						>Start Game</button
					>
					<button class="font-semibold text-gray-600 active:scale-95 hover:text-gray-700 text-right"
						>Manage Players</button
					>
					<button class="font-semibold text-gray-600 active:scale-95 hover:text-gray-700 text-right"
						>Not Ready</button
					>
					<button class="font-semibold text-red-600 active:scale-95 hover:text-red-700 text-right"
						>Leave Queue</button
					>
				{:else}
					<button class="font-semibold text-red-600 active:scale-95 hover:text-red-700 text-right"
						>Report</button
					>
				{/if}
			</div>
		</div>
	</AccordionContent>
</Accordion>
