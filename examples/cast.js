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
      type: "integer",
      examples: [25],
      default: "25"
    },
    accountBalance: {
      $id: "#/properties/age",
      type: "number",
      examples: [1, 9.01],
      default: 0
    }
  }
};

const person = {id: "1", name: "John Doe", age: 30, accountBalance: "2536.72"}

validPerson = jsonSchemaApplier(person, peopleSchema);

console.log(validPerson);