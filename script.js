const { readFileSync, writeFile } = require('fs');
const { promisify } = require('util');
const Octokit = require('@octokit/rest');

const octokit = Octokit({
    auth: readFileSync('token', 'utf8').trim(),
    baseUrl: 'https://api.github.com'
});

const writeFileAsync = promisify(writeFile);

/**
 * Returns usernames of all mozilla-mobile members.
 * @returns {Promise<Set<string>>}
 */
async function listMembers() {
    const options = octokit.orgs.listMembers.endpoint.merge({
        org: 'mozilla-mobile'
    });
    const members = await octokit.paginate(options);
    return new Set(members.map(member => member.login));
}

/**
 * Returns async iterator over PR list in October.
 * @param {number} year
 * @param {Set<string>} ignoreUsers
 */
async function* hacktoberfestPrs(year, ignoreUsers) {
    const options = octokit.search.issuesAndPullRequests.endpoint.merge({
        q: [
            'is:pr',
            'org:mozilla-mobile',
            // During October
            `created:${year}-10-01..${year}-10-31`,
            // No invalid PRs
            '-label:invalid',
            // Ignore bots
            '-author:MickeyMoz',
            '-author:mozilla-l10n-automation-bot',
            // Ignore Mozilla members not in the org
            '-author:espertus'
        ].join(' ')
    });
    for await (const response of octokit.paginate.iterator(options)) {
        for (const pr of response.data) {
            if (!ignoreUsers.has(pr.user.login)) {
                yield pr;
            }
        }
    }
}

async function main(year) {
    const members = await listMembers();
    const allContributions = {};
    for await (const pr of hacktoberfestPrs(year, members)) {
        const contributions = allContributions[pr.user.login] || [];
        contributions.push({
            url: pr.html_url,
            title: pr.title,
            repo: pr.repository_url.substring('https://api.github.com/repos/'.length),
        });
        allContributions[pr.user.login] = contributions;
    }

    await writeFileAsync('docs/contributions.json', JSON.stringify(allContributions));
}

main(2019);
