const segments = {};
export default segments;

export function resetSegments() {
  for(const key in segments) {
    delete segments[key];
  }
}