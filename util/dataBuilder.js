var fs = require('fs')
var csv = require('csvtojson')

const rawPath = '../assets/data/'
const outputPath = '../assets/data/'

const data = {
    "year1/2": []
}

const generateDatabase = function (input, output) {
    // Check CSV format
    if (input.split('.')[input.split('.').length - 1] !== 'csv') {
        console.error('Csv format expected for input file')
        return
    }

    const inputCsv = input
    const outputJson = output

    // CONVERT TO JSON
    csv({noheader: false, ignoreEmpty: true})
        .fromFile(inputCsv)
        .on('end_parsed', function (json) {

            json.map((row) => {

                if (row['Year 1 & 2 words']) {
                    if (!row['Year 1 & 2 words']) { return }
                    if (!row['Year 1 & 2 Hints']) { return }
                    if (!row['Year 1 & 2 Sentences']) { return }

                    var word = {
                        "word": row['Year 1 & 2 words'],
                        "hint": row['Year 1 & 2 Hints'],
                        "sentence": row['Year 1 & 2 Sentences']
                    }
                    data["year1/2"].push(word)
                }
                 if (row['Year 3 & 4 words']) {
                    if (!row['Year 3 & 4 words']) { return }
                    if (!row['Year 3 & 4 Hints']) { return }
                    if (!row['Year 3 & 4 Sentences']) { return }

                    var word = {
                        "word": row['Year 3 & 4 words'],
                        "hint": row['Year 3 & 4 Hints'],
                        "sentence": row['Year 3 & 4 Sentences']
                    }
                    data["year3/4"].push(word)
                }
           })

            fs.writeFile(outputJson, JSON.stringify(data), 'utf8', function (err) {
                if (err) {
                    return console.log(err)
                }
            })
        })
}

generateDatabase(`${rawPath}/raw.csv`, `${outputPath}/data.json`)
