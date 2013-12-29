

function atom(type, val) {
  switch (type) {
    case 'variable':
      return {
        type: type,
        name: val
      };
    default:
      return {
        type: type,
        value: val
      };
  }
}

module.exports = atom;
