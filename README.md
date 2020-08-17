# i18n-helper
Simple Translation that converts one base .json file with all the languages, and splits it to the multiple language json.

### Usage
```node i18n-helper.js base.json outputDir```

##### Base.json
Your Base Language JSON must include the following.
```js
{
  //all your languages here, as output
  //this will output en.json, es.json, fr.json
  "lang": ["en", "es", "fr"],
  //data includes your whole scheme
  //all entries must be in an array similar, in the same order as lang.
  "data": {
    "general": {
      "hello": ["Hello", "Hola", "Bonjour"]
    }
  }
}
```
##### Output
```json
//en.json
{
  "general": {
    "hello": "Hello"
  }
}
//es.json
{
  "general":{
    "hello": "Hola"
  }
}
//fr.json
{
  "general":{
    "hello": "Bonjour"
  }
}
```
