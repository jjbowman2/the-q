<script lang="ts">
	import { getContext } from 'svelte';
	import type { AccordionContext } from './types';
	import { slide } from 'svelte/transition';

	const { expanded } = getContext<AccordionContext>('accordion');
</script>

{#if $expanded}
	<div transition:slide>
		<slot />
	</div>
{/if}
