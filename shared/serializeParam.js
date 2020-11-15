export default function serializeParam(value) {
  return value && value.toJSON !== undefined ? value.toJSON() : value;
}