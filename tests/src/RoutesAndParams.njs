import Nullstack from 'nullstack';

class RoutesAndParams extends Nullstack {

  eventTriggered = false;

  hydrate({router}) {
    window.addEventListener(router.event, () => {
      this.eventTriggered = true;
    });
  }

  renderOther({params}) {
    return (
      <div> 
        <div data-other />
        <div data-a route="/routes-and-params/a" />
        <div data-id={params.id} route="*" />
      </div>
    )
  }

  renderWildcard() {
    return (
      <div data-wildcard />
    )
  }
  
  render({router, params}) {
    return (
      <div> 
        <div data-event-triggered={this.eventTriggered} />
        <div data-router={!!router} />
        <div route="/routes-and-params" data-route="/routes-and-params" />
        <Other route="/routes-and-params/:id" />
        <Wildcard route="/routes-and-params/*" />
        <a href="/routes-and-params/a"> a </a>
        <a params={{framework: 'nullstack'}}> string </a>
        <a path="/routes-and-params/d"> path </a>
        <div data-url={router.url} />
        <div data-path={router.path} />
        <div data-empty={params.empty} />
        <div data-boolean={params.boolean} />
      </div>
    )
  }

}

export default RoutesAndParams;