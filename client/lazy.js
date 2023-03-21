import LazyComponent from "../shared/lazyComponent"

export default function lazy(_hash, importer) {
  return class extends LazyComponent {
    importer = importer
  }
}