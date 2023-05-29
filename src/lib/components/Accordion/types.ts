import type { Writable } from 'svelte/store';

export interface AccordionContext {
	expanded: Writable<boolean>;
	toggle: () => void;
}
