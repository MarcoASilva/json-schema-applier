const jsonSchemaApplier = require("./lib");

const peopleSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "http://example.com/example.json",
  type: "object",
  title: "The root schema",
  description: "The root schema comprises the entire JSON document.",
  default: {},
  examples: [
    {
      id: 1,
      name: "John Doe",
      dateOfBirth: "1990-01-01",
			email: "john@doe.com",
			age: 30
    }
  ],
  required: [
    "id",
		"email",
		"dateOfBirth"
  ],
  properties: {
    id: {
      $id: "#/properties/id",
      type: "integer",
      title: "The id schema",
      description: "An explanation about the purpose of this instance.",
      default: 0,
      examples: [4021]
    },
    name: {
      $id: "#/properties/name",
      type: "string",
      title: "The name schema",
      description: "An explanation about the purpose of this instance.",
      default: "Guest",
      examples: ["John Doe"]
    },
    dateOfBirth: {
      $id: "#/properties/dateOfBirth",
      type: "string",
      title: "The dateOfBirth schema",
      description: "An explanation about the purpose of this instance.",
      examples: ["1990-01-01"]
    },
    email: {
      $id: "#/properties/email",
      type: "string",
      title: "The email schema",
      description: "An explanation about the purpose of this instance.",
      // default: null,
      examples: ["john@doe.com"]
    },
    age: {
      $id: "#/properties/age",
      type: "number",
      title: "The age schema",
      description: "An explanation about the purpose of this instance.",
      examples: [30]
    },
  },
  additionalProperties: false
};

const person = {
	id: 2,
	// email: "mary@allen.com",
	dateOfBirth: "2000-01-01"
}

peopleSchema.properties.age.default = (person) => (+new Date() - +new Date(person.dateOfBirth)) /1000/60/60/24/365;

validPerson = jsonSchemaApplier(person, peopleSchema);

console.log(validPerson);

// newRev = jsonSchemaApplier(revendedor, schema, {
//   estadoEntrega: {
//     equals: {
//       // '': 0
//     },
//     isType: {
//       // string: 1
//     },
//     custom: instance => instance.id
//   }
// });