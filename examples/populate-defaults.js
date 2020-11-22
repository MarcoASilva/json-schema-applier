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