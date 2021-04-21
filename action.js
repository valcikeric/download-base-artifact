const core = require("@actions/core");
const github = require("@actions/github");
const { downloadBaseArtifact } = require("./index");

(async () => {
	try {
		const token = core.getInput("github_token", { required: true });
		const workflow = core.getInput("workflow", { required: false });
		const artifact = core.getInput("artifact", { required: true });
		const path = core.getInput("path", { required: false });
		const allowfail = core.getInput("allow-fail", { required: false });

		const octokit = github.getOctokit(token);
		const inputs = { workflow, artifact, path, allowfail };

		core.debug("Inputs: " + JSON.stringify(inputs, null, 2));
		core.debug("Context: " + JSON.stringify(github.context, undefined, 2));

		const context = JSON.stringify(github.context, undefined, 2);
		console.log(`The event context: ${context}`);

		const actionLogger = {
			warn(msg) {
				core.warning(msg);
			},
			info(msg) {
				core.info(msg);
			},
			debug(getMsg) {
				core.debug(getMsg());
			},
		};

		await downloadBaseArtifact(octokit, github.context, inputs, actionLogger);
	} catch (e) {
		core.setFailed(e.message);
	}
})();
