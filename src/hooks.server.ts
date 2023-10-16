// import type { Database } from './db/supabase.types';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a supabase client on the server and store it in event locals
	event.locals.supabase = createSupabaseServerClient/*<Database>*/({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * A convenience helper so we can just call await getSession() instead const { data: { session } } = await supabase.auth.getSession()
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// const {
	// 	data: { session }
	// } = await event.locals.supabase.auth.getSession();

	// if (event.route.id?.includes('root')) {
	// 	// This checks if the requested route falls under the root (authenticated) group route
	// 	// Check if the user is authenticated
	// 	if (!session) {
	// 		// Redirect if not
	// 		throw redirect(302, '/login');
	// 	}
	// }

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
