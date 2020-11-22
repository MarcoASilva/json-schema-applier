function setDefault(object, prop, schema) {

  if(schema.properties[prop].default === undefined) return;
  object[prop] =
    (schema.properties[prop].default &&
      schema.properties[prop].default(object))
}

function remove(object, prop) {
  
  delete object[prop];
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

function setString(object, prop, config) {

  const string = String(object[prop]).toString();
  
  object[prop] = config[string] && config[string].string !== undefined? config[string].string : string;
}

function setInteger(object, prop, config) {

  const integer = parseInt(String(object[prop]).toString());
  
  object[prop] = config[integer] && config[integer].integer !== undefined? config[integer].integer : integer;
}

function setNumber(object, prop, config) {

  const number = Number(object[prop]);
  
  object[prop] = config[number] && config[number].number !== undefined? config[number].number : number;
}

function setBoolean(object, prop, config) {

  const boolean = Boolean(object[prop]);
  
  object[prop] = config[boolean] && config[boolean].boolean !== undefined? config[boolean].boolean : boolean;
}

function setArray(object, prop, config) {

  if(!Array.isArray(object[prop])) {
    object[prop] = [object[prop]];
  }
}

function isRequired(prop, schema) {

  return schema.required && Array.isArray(schema.required) && schema.required.includes(prop);
}

function setDefaultOverwrite(object, prop, schema, config) {
  
  switch (schema.properties[prop].type) {
    case "string":
      setString(object, prop, config);
      break;
    case "integer":
      setInteger(object, prop, config);
      break;
    case "number":
      setNumber(object, prop, config);
      break;
    case "boolean":
      setBoolean(object, prop, config);
      break;
    case "array":
      setArray(object, prop, config);
      break;
    default: 
      break;
  }
}

function apply(object, prop, schema, config, overwrite) {

  if(!schema.properties[prop]) {
    return;
  }

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

  return setDefaultOverwrite(object, prop, schema, config);
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
  },
  config = {
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
      instance[prop] = jsonSchemaApplier(instance[prop], schema[prop], overwrites[prop]);
    }
    apply(instance, prop, schema, config, overwrites[prop]);
  }
  
  for(const prop in schema.properties) {
    if(instance[prop] === undefined) {
      if(isRequired(prop, schema)) {
        apply(instance, prop, schema, config, overwrites[prop]);
      }
    }
  }
	
	return instance;
}

exports.jsonSchemaApplier = jsonSchemaApplier;
module.exports = jsonSchemaApplier;