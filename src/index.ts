import Statsig from 'statsig-node'

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const requestParams = await request.json();
		const userID = requestParams.userID;

		await Statsig.initialize(env.STATSIG_SECRET_KEY);

		const assignmentsRaw = Statsig.getClientInitializeResponse({ userID },'', { hash: 'none'});

		const passingAssignments = Object.values(assignmentsRaw?.feature_gates)
			.filter(({ value }) => value)
			.map(({ name }) => name);

		const cacheKey = passingAssignments.join('-');

		return new Response(JSON.stringify({
			passingAssignments,
			cacheKey
		}));
	},
} satisfies ExportedHandler<Env>;
