const fs = require('fs');
const path = require('path');

function loadFixture(name) {
	try {
		return JSON.parse(
			fs.readFileSync(path.join(__dirname, 'fixtures', name), 'utf8')
		);
	} catch {
		return null;
	}
}

const hygraphFixture = loadFixture('hygraph-author.json');
const devtoFixture = loadFixture('devto-posts.json');

const originalFetch = globalThis.fetch;

globalThis.fetch = async function (url, ..._args) {
	const urlString = typeof url === 'string' ? url : url.toString();

	if (urlString.includes('hygraph')) {
		return new Response(JSON.stringify({ data: hygraphFixture }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (urlString.includes('dev.to')) {
		return new Response(JSON.stringify(devtoFixture), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return originalFetch.apply(this, arguments);
};
