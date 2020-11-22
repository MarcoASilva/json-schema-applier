const jsonSchemaApplier = require("../lib");

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