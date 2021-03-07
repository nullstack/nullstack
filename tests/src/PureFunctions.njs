export const AnonComponent = function(context) {
  return (
    <div data-anon={context.params.works} id={context.id} />
  )
}

export function NamedComponent(context) {
  return (
    <div data-named={context.params.works} id={context.id} />
  )
}

export const ArrowComponent = (context) => {
  return (
    <div data-arrow={context.params.works} id={context.id} />
  )
}