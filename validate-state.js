export function resetState() {
  if(this.schema) {
    const state = {};
    Object.keys(this.schema).forEach((recordKey) => {
      state[recordKey] = {...this.state[recordKey], errors: {}};
      Object.keys(this.schema[recordKey]).forEach((propertyKey) => {
        const schema = this.schema[recordKey][propertyKey];
        if(schema.type == 'string' && !state[recordKey][propertyKey]) {
          state[recordKey][propertyKey] = schema.value || '';
        } else if(schema.type == 'boolean' && !state[recordKey][propertyKey]) {
          state[recordKey][propertyKey] = schema.value || false;
        } else if(schema.type == 'integer' && !state[recordKey][propertyKey]) {
          state[recordKey][propertyKey] = schema.value || 0;
        } else if(schema.type == 'float' && !state[recordKey][propertyKey]) {
          state[recordKey][propertyKey] = schema.value || 0;
        } else if(schema.type == 'array' && !state[recordKey][propertyKey]) {
          state[recordKey][propertyKey] = schema.value || [];
        }
      });
    });
    this.state = {...this.state, ...state};
  }
  this.state = {...this.state, loading: {}};
}

export async function validateState(rules) {
  if(!rules) {
    rules = this.schema;
  }
  const state = {};
  let valid = true;
  for(const recordKey of Object.keys(rules)) {
    const record = rules[recordKey]
    state[recordKey] = {...this.state[recordKey]};
    state[recordKey].errors = {...state[recordKey].errors}
    for(const propertyKey of Object.keys(record)) {
      const rule = record[propertyKey];
      let value;
      if(rule.type == 'string') {
        value = (this.state[recordKey][propertyKey] || '').trim();
      } else if(rule.type == 'float') {
        value = parseFloat(this.state[recordKey][propertyKey] || '0');
      } else if(rule.type == 'integer') {
        value = parseInt(this.state[recordKey][propertyKey] || '0');
      } else if(rule.type == 'boolean') {
        value = !!this.state[recordKey][propertyKey];
      } else if(rule.type == 'array') {
        value = this.state[recordKey][propertyKey] || [];
      }
      state[recordKey][propertyKey] = value;
      if(rule.required && !value) {
        state[recordKey]['errors'][propertyKey] = this.errorMessages.required;
        valid = false;
      } else if(rule.gt && value < rule.gt) {
        state[recordKey]['errors'][propertyKey] = this.errorMessages.gt;
        valid = false;
      } else if (rule.with) {
        const customError = await this[rule.with](recordKey, propertyKey, value);
        if(customError) {
          state[recordKey]['errors'][propertyKey] = customError;
          valid = false;
        }
      }
      if(valid) {
        delete state[recordKey]['errors'][propertyKey];
      }
    }
  }
  this.setState(state);
  return valid;
}

export function bindState(record, property) {
  let recordKey, propertyKey, schema;
  if(!property) {
    recordKey = Object.keys(record)[0];
    propertyKey = Object.keys(record[recordKey])[0];
    schema = record;
  } else {
    recordKey = record;
    propertyKey = property;
    schema = {[recordKey]: {[propertyKey]: this.schema[recordKey][propertyKey]}};
  }
  const recordID = recordKey.split(/(?=[A-Z])/).join('_').toLowerCase();
  const propertyID = propertyKey.split(/(?=[A-Z])/).join('_').toLowerCase();
  return {
    id: `${recordID}_${propertyID}`,
    value: this.state[recordKey][propertyKey],
    checked: (this.state[recordKey][propertyKey] == true),
    onChange: (event) => {
      let value = event;
      if(event.target) {
        value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      }
      const record = {...this.state[recordKey]};
      record[propertyKey] = value;
      this.setState({[recordKey]: record});
    },
    onBlur: (event) => {
      this.validateState(schema);
    },
    required: this.state[recordKey]['errors'] && this.state[recordKey]['errors'][propertyKey]
  }
}
