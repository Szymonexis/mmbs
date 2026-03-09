import { RECAPTCHA_PROJECT_ID, RECAPTCHA_SERVICE_ACCOUNT_KEY } from '$env/static/private';
import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
import type { RecaptchaAction } from '$shared/recaptcha-action';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

function getCredentials() {
	const decoded = Buffer.from(RECAPTCHA_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8');
	return JSON.parse(decoded);
}

export async function createAssessment({
	projectId = RECAPTCHA_PROJECT_ID,
	recaptchaKey = PUBLIC_RECAPTCHA_SITE_KEY,
	token,
	recaptchaAction
}: {
	projectId?: string;
	recaptchaKey?: string;
	token: string;
	recaptchaAction: RecaptchaAction;
}) {
	const credentials = getCredentials();
	const client = new RecaptchaEnterpriseServiceClient({ credentials });

	try {
		const projectPath = client.projectPath(projectId);

		const request = {
			assessment: {
				event: {
					token: token,
					siteKey: recaptchaKey
				}
			},
			parent: projectPath
		};

		const [response] = await client.createAssessment(request);

		if (!response.tokenProperties?.valid) {
			console.log(
				`The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`
			);
			return null;
		}

		if (response.tokenProperties?.action === recaptchaAction) {
			console.log(`The reCAPTCHA score is: ${response.riskAnalysis?.score}`);
			response.riskAnalysis?.reasons?.forEach((reason) => {
				console.log(reason);
			});

			return response.riskAnalysis?.score ?? null;
		} else {
			console.log(
				'The action attribute in your reCAPTCHA tag does not match the action you are expecting to score'
			);
			return null;
		}
	} finally {
		await client.close();
	}
}
