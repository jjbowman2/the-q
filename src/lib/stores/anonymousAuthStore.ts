import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

const KEY = 'anonymous-auth';

const storedAnonymousAuthToken = browser ? localStorage.getItem(KEY) ?? uuid() : uuid();
export const anonymousAuthToken = writable(storedAnonymousAuthToken);
anonymousAuthToken.subscribe((value) => {
	if (browser) localStorage?.setItem(KEY, value);
});
