<script lang="ts">
	import { getContext } from 'svelte';
	import { ChevronUp } from 'lucide-svelte';
	import type { AccordionContext } from './types';
	const { expanded, toggle } = getContext<AccordionContext>('accordion');
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="flex justify-between cursor-pointer" on:click={toggle}>
	<slot />
	<button
		on:click={(e) => {
			e.stopPropagation();
			toggle();
		}}
		class={'transition-transform' + ($expanded ? '' : ' rotate-90')}
	>
		<ChevronUp class="text-gray-600" />
	</button>
</div>
