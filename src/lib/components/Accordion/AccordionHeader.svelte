<script lang="ts">
	import { getContext } from 'svelte';
	import { ChevronUp } from 'lucide-svelte';
	import type { AccordionContext } from './types';
	const { expanded, toggle } = getContext<AccordionContext>('accordion');
</script>

<div class="flex justify-between">
	<slot />
	<button on:click={toggle} class={'transition-transform' + ($expanded ? '' : ' rotate-90')}>
		<ChevronUp class="text-gray-600" />
	</button>
</div>
