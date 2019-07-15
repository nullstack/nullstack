import slugify from 'slugify';

export function queryString(delta) {
  const props = {...this.props, ...delta};
  const defaultProps = this.constructor.defaultProps;
  const keys = Object.keys(props).filter((k) => props[k] != defaultProps[k]);
  return keys.map(k => k + '=' + props[k]).join('&');
}

export function bindProp(property) {
  const redirect = (event) => {
    const value = event.target.value;
    if(value != this.props[property]) {
      const query = this.queryString({[property]: value});
      const path = location.pathname;
      this.redirect(`${path}?${query}`);
    }
  }
  return {
    defaultValue: this.props[property],
    onKeyPress: (event) => {
      if (event.key === 'Enter') {
        redirect(event);
      }
    },
    onBlur: redirect
  }
}

export function whitelistState() {
  const state = {}
  for(const recordKey of Object.keys(this.schema)) {
    if(Array.isArray(this.state[recordKey])) {
      state[recordKey] = [];
      for(const object of this.state[recordKey]) {
        const clone = {};
        for(const propertyKey of Object.keys(object)) {
          const rule = this.schema[recordKey][propertyKey];
          if(rule) {
            if(rule.type == 'slug') {
              const slugs = [];
              if(rule.source instanceof Array) {
                for(const sourceKey of rule.source) {
                  slugs.push((object[sourceKey] || '').toString());
                }
              } else {
                slugs.push((object[rule.source] || '').toString());
              }
              const value = slugs.join('-').replace(/[\W_]+/g, "-");
              clone[propertyKey] = slugify(value, {lower: true});
            } else {
              clone[propertyKey] = object[propertyKey];
            }
          }
        }
        const timestamp = new Date();
        clone.updated = timestamp;
        if(!object.created) {
          clone.created = timestamp;
        } else {
          clone.created = new Date(object.created);
        }
        state[recordKey].push(clone);
      }
    } else {
      state[recordKey] = {};
      for(const propertyKey of Object.keys(this.state[recordKey])) {
        const rule = this.schema[recordKey][propertyKey];
        if(rule) {
          if(rule.type == 'slug') {
            const slugs = [];
            if(rule.source instanceof Array) {
              for(const sourceKey of rule.source) {
                slugs.push((this.state[recordKey][sourceKey] || '').toString());
              }
            } else {
              slugs.push((state[recordKey][rule.source] || '').toString());
            }
            const value = slugs.join('-').replace(/[\W_]+/g, "-");
            state[recordKey][propertyKey] = slugify(value, {lower: true});
          } else {
            state[recordKey][propertyKey] = this.state[recordKey][propertyKey];
          }
        }
      }
      const timestamp = new Date();
      state[recordKey].updated = timestamp;
      if(!this.state[recordKey].created) {
        state[recordKey].created = timestamp;
      } else {
        state[recordKey].created = new Date(this.state[recordKey].created);
      }
    }
  }
  return state;
}

export function resetState() {
  if(this.schema) {
    const state = {};
    Object.keys(this.schema).forEach((recordKey) => {
      if(!Array.isArray(this.state[recordKey])) {
        state[recordKey] = {...this.state[recordKey], errors: {}};
        Object.keys(this.schema[recordKey]).forEach((propertyKey) => {
          const schema = this.schema[recordKey][propertyKey];
          if(schema.type == 'slug' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || '';
          } else if(schema.type == 'string' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || '';
          } else if(schema.type == 'boolean' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || false;
          } else if(schema.type == 'integer' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || 0;
          } else if(schema.type == 'float' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || 0;
          } else if(schema.type == 'array' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || [];
          } else if(schema.type == 'image' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value;
          } else if(schema.type == 'images' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || [];
          } else if(schema.type == 'files' && !state[recordKey][propertyKey]) {
            state[recordKey][propertyKey] = schema.value || [];
          }
        });
      }
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
    const record = rules[recordKey];
    if(Array.isArray(this.state[recordKey])) {
      state[recordKey] = [];
      let index = 0;
      for(const object of this.state[recordKey]) {
        state[recordKey][index] = {errors: {}};
        for(const propertyKey of Object.keys(record)) {
          const rule = record[propertyKey];
          let value;
          /****/
          if(rule.type == 'string') {
            value = (object[propertyKey] || '').trim();
          } else if(rule.type == 'float') {
            value = object[propertyKey] || '0';
            if(typeof value === 'string' && value.indexOf(',') > -1) {
              value = value.replace(/\./g,'').replace(',', '.');
            }
            value = parseFloat(value);
          } else if(rule.type == 'integer') {
            value = parseInt(object[propertyKey] || '0');
          } else if(rule.type == 'boolean') {
            value = !!object[propertyKey];
          } else if(rule.type == 'array') {
            value = object[propertyKey] || [];
          } else if(rule.type == 'image') {
            value = object[propertyKey];
          } else if(rule.type == 'images') {
            value = object[propertyKey] || [];
          } else if(rule.type == 'files') {
            value = object[propertyKey] || [];
          }
          state[recordKey][index][propertyKey] = value;
          if(rule.required && !value) {
            state[recordKey][index]['errors'][propertyKey] = this.errorMessages.required;
            valid = false;
          } else if(rule.format == 'email' && !(/\S+@\S+\.\S+/).test(value)) {
            state[recordKey][index]['errors'][propertyKey] = this.errorMessages.invalid;
            valid = false;
          } else if(rule.min && rule.type =='string' && value && value.length < rule.min) {
            state[recordKey][index]['errors'][propertyKey] = this.errorMessages.min;
            valid = false;
          } else if(rule.max && rule.type =='string' && value && value.length > rule.max) {
            state[recordKey][index]['errors'][propertyKey] = this.errorMessages.max;
            valid = false;
          } else if(rule.gt && value < rule.gt) {
            state[recordKey][index]['errors'][propertyKey] = this.errorMessages.gt;
            valid = false;
          } else if(rule.confirm && value != state[recordKey][index][rule.confirm]) {
            state[recordKey][index]['errors'][propertyKey] = this.errorMessages.confirm;
            valid = false;
          } else if (rule.with) {
            const customError = await this[rule.with](recordKey, propertyKey, value);
            if(customError) {
              state[recordKey][index]['errors'][propertyKey] = customError;
              valid = false;
            }
          }
          if(valid) {
            delete state[recordKey][index]['errors'][propertyKey];
          }
          /***/
        }
        index++;
      }
    } else {
      state[recordKey] = {...this.state[recordKey]};
      state[recordKey].errors = {...state[recordKey].errors};
      for(const propertyKey of Object.keys(record)) {
        const rule = record[propertyKey];
        let value;
        if(rule.type == 'string') {
          value = (this.state[recordKey][propertyKey] || '').trim();
        } else if(rule.type == 'float') {
          value = this.state[recordKey][propertyKey] || '0';
          if(typeof value === 'string' && value.indexOf(',') > -1) {
            value = value.replace(/\./g,'').replace(',', '.');
          }
          value = parseFloat(value);
        } else if(rule.type == 'integer') {
          value = parseInt(this.state[recordKey][propertyKey] || '0');
        } else if(rule.type == 'boolean') {
          value = !!this.state[recordKey][propertyKey];
        } else if(rule.type == 'array') {
          value = this.state[recordKey][propertyKey] || [];
        } else if(rule.type == 'image') {
          value = this.state[recordKey][propertyKey];
        } else if(rule.type == 'images') {
          value = this.state[recordKey][propertyKey] || [];
        } else if(rule.type == 'files') {
          value = this.state[recordKey][propertyKey] || [];
        }
        state[recordKey][propertyKey] = value;
        if(rule.required && !value) {
          state[recordKey]['errors'][propertyKey] = this.errorMessages.required;
          valid = false;
        } else if(rule.format == 'email' && !(/\S+@\S+\.\S+/).test(value)) {
          state[recordKey]['errors'][propertyKey] = this.errorMessages.invalid;
          valid = false;
        } else if(rule.min && rule.type =='string' && value && value.length < rule.min) {
          state[recordKey]['errors'][propertyKey] = this.errorMessages.min;
          valid = false;
        } else if(rule.max && rule.type =='string' && value && value.length > rule.max) {
          state[recordKey]['errors'][propertyKey] = this.errorMessages.max;
          valid = false;
        } else if(rule.gt && value < rule.gt) {
          state[recordKey]['errors'][propertyKey] = this.errorMessages.gt;
          valid = false;
        } else if(rule.confirm && value != state[recordKey][rule.confirm]) {
          state[recordKey]['errors'][propertyKey] = this.errorMessages.confirm;
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
  }
  this.setState(state);
  return valid;
}

export function bindState(record, indexOrProperty, property) {
  if(property) {
    return bindMultipleState.call(this, record, indexOrProperty, property);
  } else {
    return bindSingleState.call(this, record, indexOrProperty);
  }
}

function bindMultipleState(record, index, property) {
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
  const rule = schema[recordKey][propertyKey];
  const recordID = recordKey.split(/(?=[A-Z])/).join('_').toLowerCase();
  const propertyID = propertyKey.split(/(?=[A-Z])/).join('_').toLowerCase();
  const value = rule.type == 'image' || rule.type == 'images' ? '' : this.state[recordKey][index][propertyKey];
  return {
    value,
    id: `${recordID}_${index}_${propertyID}`,
    checked: (this.state[recordKey][index][propertyKey] == true),
    onChange: async (event) => {
      let value = event;
      if(rule.type == 'image') {
        value = await this.uploadImage(recordKey, propertyKey, event.target.files[0]);
      } else if(rule.type == 'images') {
        const files = Array.from(event.target.files);
        value = [...this.state[recordKey][propertyKey]];
        for (const file of files) {
          const image = await this.uploadImage(recordKey, propertyKey, file);
          value.push(image);
        }
      } else if(rule.type == 'images') {
        const files = Array.from(event.target.files);
        value = [...this.state[recordKey][propertyKey]];
        for (const file of files) {
          const image = await this.uploadFile(recordKey, propertyKey, file);
          value.push(image);
        }
      } else if(event.target) {
        value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      }
      const record = {...this.state[recordKey][index]};
      record[propertyKey] = value;
      const array = [...this.state[recordKey]];
      array[index] = record;
      this.setState({[recordKey]: array});
      /*if(rule.type == 'image') {
        this.validateState(schema);
      } else if(rule.type == 'images') {
        this.validateState(schema);
      }*/
    },
    onBlur: (event) => {
      //this.validateState(schema);
    },
    maxLength: (rule.type == 'string' && rule.lte) ? rule.lte : null
  }
}

function bindSingleState(record, property) {
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
  const rule = schema[recordKey][propertyKey];
  const recordID = recordKey.split(/(?=[A-Z])/).join('_').toLowerCase();
  const propertyID = propertyKey.split(/(?=[A-Z])/).join('_').toLowerCase();
  const value = rule.type == 'image' || rule.type == 'images' || rule.type == 'files' ? '' : this.state[recordKey][propertyKey];
  return {
    value,
    id: `${recordID}_${propertyID}`,
    checked: (this.state[recordKey][propertyKey] == true),
    onChange: async (event) => {
      let value = event;
      if(rule.type == 'image') {
        value = await this.uploadImage(recordKey, propertyKey, event.target.files[0]);
      } else if(rule.type == 'images') {
        const files = Array.from(event.target.files);
        value = [...this.state[recordKey][propertyKey]];
        for (const file of files) {
          const image = await this.uploadImage(recordKey, propertyKey, file);
          value.push(image);
        }
      } else if(rule.type == 'files') {
        const files = Array.from(event.target.files);
        value = [...this.state[recordKey][propertyKey]];
        for (const file of files) {
          const image = await this.uploadFile(recordKey, propertyKey, file);
          value.push(image);
        }
      } else if(event.target) {
        value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      }
      const record = {...this.state[recordKey]};
      record[propertyKey] = value;
      this.setState({[recordKey]: record});
      if(rule.type == 'image') {
        this.validateState(schema);
      } else if(rule.type == 'images') {
        this.validateState(schema);
      } else if(rule.type == 'files') {
        this.validateState(schema);
      }
    },
    onBlur: (event) => {
      this.validateState(schema);
    },
    maxLength: (rule.type == 'string' && rule.lte) ? rule.lte : null
  }
}
