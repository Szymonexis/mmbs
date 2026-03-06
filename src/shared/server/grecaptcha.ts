import { RECAPTCHA_PROJECT_ID } from '$env/static/private';
import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
import type { RecaptchaAction } from '$shared/recaptcha-action';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

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
	const client = new RecaptchaEnterpriseServiceClient();

	const performAssessment = async () => {
		const projectPath = client.projectPath(projectId);

		// Utwórz żądanie oceny.
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

		// Sprawdź, czy token jest prawidłowy.
		if (!response.tokenProperties?.valid) {
			console.log(
				`The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`
			);
			return null;
		}

		if (response.tokenProperties?.action === recaptchaAction) {
			// Uzyskaj ocenę ryzyka i jego przyczyny.
			// Więcej informacji o interpretowaniu testu znajdziesz tutaj:
			// https://cloud.google.com/recaptcha/docs/interpret-assessment
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
	};

	const result = await performAssessment();
	await client.close();
	return result;
}
