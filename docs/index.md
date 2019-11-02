# [hacktoberfest-stats](https://github.com/NotWoods/hacktoberfest-stats)

Spits out some stats on the pull requests submitted to the
[mozilla-mobile](https://github.com/mozilla-mobile/) organization during
Hacktoberfest!

Open the console to play with the results.

<script>
fetch('contributions.json')
    .then(res => res.json())
    .then(json => {
        self.contributions = json;
        console.log('Try out the `contributions` object!')
    })
</script>
