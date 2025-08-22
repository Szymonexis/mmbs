export function getEmailRequestContent(from: string, text: string): string {
	const htmlComplientText = text.replace(/\n/g, '<br />');
	const htmlComplientFrom = from.replace(/\n/g, '<br />').replace(/ /g, '&nbsp;');

	return `
    <div>Message from:</div>
    <div>${htmlComplientFrom}</div>
    <br />
    <div>Message:</div>
    <div">${htmlComplientText}</div>
  `;
}
