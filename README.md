# json-schema-applier

json-schema-applier is an NPM Package for applying (enforcing) objects to be schema compliant.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to install json-schema-applier.

```bash
npm i json-schema-applier
```


## Description

json-schema-applier is a package for applying a json schema to given object instance and it does 2 things: 

__CREATE FIELDS__: For fields that are missing in the object instance:

  * Creates required fields
  * Creates fields that have a default value
    * You can override the default property in the field schema with a function that receive the instance object as parameter and should return the default value for that field

__CAST FIELDS__: For fields that exists in the object instance:
  * Casts value accordingly
    * You can overwrite global map config object to cast any instance field value to anything that you want based on the field type.
    * You can create custom overwrites for each field independtly of their types

__All according to the json schema passed as parameter__


## Usage - Fields creation

### Create defaults

json-schema-applier will create or populate fields that have a default value on its schema

```javascript
const apply = require('json-schema-applier');

const peopleSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "http://example.com/example.json",
  type: "object",
  title: "Person schema",
  description: "The root schema comprises the entire JSON document.",
  default: {},
  examples: [
    {
      name: "Rose Mary",
			age: 30
    }
  ],
  required: [],
  properties: {
    name: {
      $id: "#/properties/name",
      type: "string",
      default: "Guest",
      examples: ["John Doe"]
    },
    age: {
      $id: "#/properties/age",
      type: "number",
      examples: [25],
      default: 25
    },
  }
};

const person = {}

validPerson = jsonSchemaApplier(person, peopleSchema);

console.log(validPerson);
// OUTPUTS:
{ name: 'Guest', age: 25}
```

or overriding the schema.properties[prop].default value with a function:

```javascript
const peopleSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "http://example.com/example.json",
  type: "object",
  title: "Person schema",
  description: "The root schema comprises the entire JSON document.",
  default: {},
  examples: [
    {
      name: "Rose Mary",
			age: 30
    }
  ],
  required: [],
  properties: {
    name: {
      $id: "#/properties/name",
      type: "string",
      default: "Guest",
      examples: ["John Doe"]
    },
    dateOfBirth: {
      $id: "#/properties/deteOfBirth",
      type: "string",
      default: "1900-01-01",
      examples: ["1900-01-01"]
    },
    age: {
      $id: "#/properties/age",
      type: "integer",
      examples: [25],
      default: 25
    },
  }
};

const person = {};

peopleSchema.properties.age.default = (person) => ((+new Date() - +new Date(person.dateOfBirth)) /1000/60/60/24/365); 

validPerson = jsonSchemaApplier(person, peopleSchema);

console.log(validPerson);
// OUTPUTS:
{ name: 'Guest', dateOfBirth: '1900-01-01', age: 120 }
```



### Create required fields

json-schema-applier will fill required fields that are missing from the object, based first, on the overwrite object and fallback to global config object (overwritable too). So overwrites > global as global is the default "from/to" mapping object.

GLOBAL config (default mapping):

```javascript
const global = {
  NaN: {
    integer: 0,
    number: 0
  },
  undefined: {
    string: '',
    boolean: true,
    integer: 123,
    number: 0
  }
}
```
Fill required fields example:

```javascript
const jsonSchemaApplier = require("./lib");

const peopleSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "http://example.com/example.json",
  type: "object",
  title: "Person schema",
  description: "The root schema comprises the entire JSON document.",
  default: {},
  examples: [
    {
      name: "Rose Mary",
      age: 30
    }
  ],
  required: ["id"],
  properties: {
    id: {
      $id: "#/properties/id",
      type: "integer",
      title: "The id schema",
      description: "An explanation about the purpose of this instance.",
      examples: [123]
    },    
    name: {
      $id: "#/properties/name",
      type: "string",
      default: "Guest",
      examples: ["John Doe"]
    },
    age: {
      $id: "#/properties/age",
      type: "number",
      examples: [25],
      default: 25
    },
  }
};

const person = {}

validPerson = jsonSchemaApplier(person, peopleSchema);

console.log(validPerson);
// OUTPUTS:
{ name: 'Guest', age: 25, id: 0 }
```






## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[APACHE-2.0](https://www.apache.org/licenses/LICENSE-2.0)