
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
      return {
        type: type,
        name: value,
        valueType: (value === 'command.ok') ? 'number' : 'string'
      };
    case 'literal:number':
      result.valueType = 'number';
    default:
      return result;
  }
}

module.exports = atom;
