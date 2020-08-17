const fs = require('fs');
let Result = [];
let inputJson = './base.json';
let outputDir = './';
async function cycleThroughObject(obj, lang, route) {
    if (route != '') route = route + '.';
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            // console.log(Result[lang]);
            await cycleThroughArray(value, lang, route + key);
        } else if (typeof (value) == "object") {
            await cycleThroughObject(value, lang, route + key);
        }
    }
}

async function cycleThroughArray(array, lang, route) {
    await addEntry({ key: route, value: array[lang] }, lang);
}

async function addEntry(entry, lang) {
    const entryTranslated = "{\"" + entry.key + "\": \"" + entry.value + "\"}";
    Result[lang] = await mergeRecursively(Result[lang], await PathToNest(JSON.parse(entryTranslated)));
}

// Point is to Iterate through the path, and insert an object for each dot
//Thanks for the guidance, allan
async function PathToNest(obj, lang) {
    let res = [];
    for (const [key, value] of Object.entries(obj)) {
        let keySet = key.split('.').reverse();
        for (let index = 0; index < keySet.length; index++) {
            const element = keySet[index];
            if (index == 0) {
                res.push("{\"" + element + "\":\"" + value + "\"}");
            } else {
                res.push("{\"" + element + "\":" + res[res.length - 1] + "}");
            }
        }
    }
    result = JSON.parse(res[res.length - 1]);
    return result;
}

//Thanks J141
function mergeRecursively(a, b) {
    //preliminary checking... if a is not an object we cannot merge... if b is not an object then we cannot mutate a.
    if (!(a instanceof Object))
        return null;
    if (!(b instanceof Object))
        return a;

    //clone a into new output object.
    let output = {};
    for (key in a)
        output[key] = a[key];

    for (key in b) {
        //if b[key] already exists on output, and either output[key] or b[key] is not an object, we cannot merge it.
        if (output[key] !== undefined && (!(output[key] instanceof Object) || !(b[key] instanceof Object)))
            continue;
        //if b[key] already exists on output, and both output[key] and b[key] are objects, merge them recursively by calling this function with the two subobjects.
        else if (output[key] !== undefined && (output[key] instanceof Object) && (b[key] instanceof Object))
            output[key] = mergeRecursively(output[key], b[key]);
        //if b[key] does not exist on output, add it.
        else if (output[key] == undefined)
            output[key] = b[key];
    }

    return output;
}

async function AttemptFormat(obj) {
    obj = JSON.stringify(obj).replace("{", "{\n").replace(",", "\n").replace("}", "\n}");
    return obj;
}

async function beginTranslation(base) {
    for (var lang of base.lang) {
        let langId = base.lang.indexOf(lang);
        console.log("Going for " + lang + ": " + langId);
        Result.push({});
        await cycleThroughObject(base.data, langId, '');
        let result = AttemptFormat(Result[langId])
        // fs.writeFile(outputDir + "/" + lang + ".json", JSON.stringify(JSON.parse(Result[langId])), () => { console.log("Printed " + lang); });
        fs.writeFile(outputDir + "/" + lang + ".json", JSON.stringify(Result[langId]), () => { console.log("Printed " + lang); });

    }
}

if (process.argv[2]) { inputJson = process.argv[2]; }
if (process.argv[3]) { outputDir = process.argv[3]; }

fs.readFile(inputJson, (err, data) => {
    if (err) throw err;
    beginTranslation(JSON.parse(data));
});

