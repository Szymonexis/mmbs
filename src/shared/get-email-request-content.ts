export function getEmailRequestContent(from: string, text: string): string {
	const htmlComplientText = text.replace(/\n/g, '<br />');

	return `
    <p>Message from ${from}:</p>

    <p style="padding: 1rem; background-color:rgb(0, 0, 0); color: #ffffffff;">${htmlComplientText}</p>
  `;
}
