var fs = require('fs'),
    args = process.argv.slice(2),
    seperator = ',',
    input = fs.readFileSync('./PolicestationData.csv', {encoding: 'UTF-8'}),
    lines = input.split('\n'),
    output = [],
    props = lines.shift().trim().split(seperator),
    i, j,
    values,
    obj;

for (i = 0; i < args.length - 1; i++) {
    if (args[i] === '-s' || args[i] === '--seperator') {
        seperator = args[i + 1];
    }
}

for (i = 0; i < lines.length; i++) {
    if (lines[i].length > 0) {
        obj = {};
        values = lines[i].split(seperator);
        for (j = 0; j < props.length; j++) {
            obj[props[j]] = values[j];
        }
        output.push(obj);
    }
}

fs.writeFileSync('PolicestationData.json', JSON.stringify(output), {encoding: 'UTF-8'});
