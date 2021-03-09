export default class Anchorable {

  static client = true;
  static server = false;

  match({node}) {
    return (
      node &&
      node.type === 'a' &&
      node.attributes.href &&
      node.attributes.href.startsWith('/') &&
      !node.attributes.target
    )
  }

  transform({node, scope}) {
    const originalEvent = node.attributes.onclick;
    node.attributes.onclick = ({event}) => {
      event.preventDefault();
      scope.context.router.url = node.attributes.href;
      if(originalEvent) {
        setTimeout(() => {
          originalEvent({...node.attributes, event});
        }, 0);
      }
    };
  }

}