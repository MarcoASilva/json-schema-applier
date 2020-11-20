function remove(object, prop) {
  delete object[prop];
}

function setDefault(object, prop, schema) {
  object[prop] =
    (schema.properties[prop].default &&
      schema.properties[prop].default(object))
}

function setCustomEqualsOverwrite(object, prop, overwrite) {
  object[prop] = overwrite.equals[object[prop]];
}

function setCustomIsTypeOverwrite(object, prop, overwrite) {
  object[prop] = overwrite.isType[typeof object[prop]];
}

function setCustomOverwrite(object, prop, overwrite) {
  object[prop] = overwrite.custom(object);
}

function setString(object, prop) {

  object[prop] = String(object[prop]).toString();
}

function setInteger(object, prop) {

  object[prop] = parseInt(String(object[prop]).toString());
}

function setNumber(object, prop) {

  object[prop] = Number(object[prop]);
}

function setBoolean(object, prop) {

  object[prop] = Boolean(object[prop]);
}

function setArray(object, prop) {

  if(!Array.isArray(object[prop])) {
    object[prop] = [object[prop]];
  }
}

function isRequired(prop, schema) {
  return schema.required.includes(prop);
}

function setDefaultOverwrite(object, prop, schema) {
  
  switch (schema.properties[prop].type) {
    case "string":
      setString(object, prop);
      break;
    case "integer":
      setInteger(object, prop);
      break;
    case "number":
      setNumber(object, prop);
      break;
    case "boolean":
      setBoolean(object, prop);
      break;
    case "array":
      setArray(object, prop);
      break;
    default: 
      break;
  }

}

function apply(object, prop, schema, overwrite) {

  if (overwrite) {
    if(overwrite.equals && typeof overwrite.equals === 'object') {
      if (overwrite.equals[object[prop]] !== undefined) {
        return setCustomEqualsOverwrite(object, prop, overwrite);
      }
    }
    if(overwrite.isType && typeof overwrite.isType === 'object') {
      if (overwrite.isType[typeof object[prop]] !== undefined) {
        return setCustomIsTypeOverwrite(object, prop, overwrite);
      }
    }
    if(overwrite.custom && typeof overwrite.custom === 'function') {
      return setCustomOverwrite(object, prop, overwrite)
    }
  }

  return setDefaultOverwrite(object, prop, schema);
}

function jsonSchemaApplier(
  object,
  schema,
  overwrites = {
    someProp: {
      equals:{
        null: null,
        undefined: undefined,
        0: 0,
        "": "",
      },
      isType: {
        number: instance => parseInt(instance.someprop),
        string: instance => instance.someProp.toString(),
        boolean: instance => true
      },
      custom: instance => instance.someProp
    }
  }
) {

  const instance = JSON.parse(JSON.stringify(object))
  
  for (const prop in schema.properties) {
    if (schema.properties[prop].default !== undefined) {
      if (typeof schema.properties[prop].default !== "function") {
        const value = schema.properties[prop].default;
        schema.properties[prop].default = () => value;
      }
    }
  }

  for (const prop in instance) {
    if (!schema.properties[prop]) {
      if (!schema.additionalProperties) {
        remove(instance, prop);
      }
    }
  }

  for (const prop in schema.properties) {
    if (instance[prop] === undefined) {
      setDefault(instance, prop, schema);
    }
  }

  for (const prop in instance) {
    if(instance[prop] && typeof instance[prop] === 'object'){
      instance[prop] = jsonSchemaApplier(instance[prop]);
    }
    apply(instance, prop, schema, overwrites[prop]);
	}
	
	return instance;
}

exports.jsonSchemaApplier = jsonSchemaApplier;
module.exports = jsonSchemaApplier;