export default function serializeParam(value) {
  return value?.toJSON?.() ?? value;
}