# [hacktoberfest-stats](https://github.com/NotWoods/hacktoberfest-stats)

Spits out some stats on the pull requests submitted to the
[mozilla-mobile](https://github.com/mozilla-mobile/) organization during
Hacktoberfest!

Open the console to play with the results (`window.contributions`).

<script>
fetch('contributions.json')
    .then(res => res.json())
    .then(json => {
        self.contributions = json;
        console.log('Try out the `contributions` object!');
    })
</script>

## Possible queries

### List out all the Hacktoberfest contributors

```js
Object.keys(contributions);
```

### Sort users based on who contributed the most

```js
var entries = Object.entries(contributions);
entries.sort((a, b) => b[1].length - a[1].length);
```

### List all the repositories that were contributed to

```js
var repos = Object.values(contributions)
    .flatMap(prs => prs.map(pr => pr.repo));
new Set(repos);
```
