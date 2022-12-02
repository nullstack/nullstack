import Nullstack, { NullstackClientContext } from 'nullstack'

interface TypeScriptExtensionProps {
  generic: boolean
  route?: string
}

class TypeScriptExtension extends Nullstack<TypeScriptExtensionProps> {

  render({ generic, environment }: NullstackClientContext & TypeScriptExtensionProps) {
    return (
      <div data-imported data-generic={generic}>
        {environment.key}
      </div>
    )
  }

}

export default TypeScriptExtension
