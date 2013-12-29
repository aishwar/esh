
function val(type, value) {
  return {
    type: type,
    value: value
  };
}

function atom(type, value) {
  var result = val(type, value);
  
  switch (type) {
    case 'variable':
      result = {
        type: type,
        name: value,
        valueType: (value === 'command.ok') ? 'number' : 'string'
      };
      break;
    case 'literal:number':
      result.valueType = 'number';
      break;
    case 'literal:string':
      result.valueType = 'string';
      break;
  }
  
  return result;
}

module.exports = atom;
