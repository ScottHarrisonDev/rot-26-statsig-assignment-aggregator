import Statsig from 'statsig-node'

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const requestParams = await request.json();
		const userID = requestParams.userID;

		await Statsig.initialize(env.STATSIG_SECRET_KEY);

		const assignments = Statsig.getClientInitializeResponse({ userID },'', { hash: 'none'});

		return new Response(JSON.stringify(assignments?.feature_gates));
	},
} satisfies ExportedHandler<Env>;
