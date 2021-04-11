import Nullstack from 'nullstack';

class RoutesAndParams extends Nullstack {

  eventTriggered = false;
  paramHydrated = false;

  hydrate({router, params}) {
    this.paramHydrated = params.id === 'a';
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

  setParamsDate({params}) {
    params.date = new Date('1992-10-16');
  }
  
  goToDocs({ router }) {
    router.url = 'https://nullstack.app';
  }

  render({router, params}) {
    return (
      <div> 
        <a href="https://nullstack.app"> Nullstack</a>
        <button data-absolute onclick={this.goToDocs}> Nullstack </button>
        <a href="/routes-and-params/no-hash#hash">hash</a>
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
        <div data-base={router.base} />
        <div data-empty={params.empty} />
        <div data-boolean={params.boolean} />
        <button data-params onclick={this.setParamsDate}> date </button>
        <div data-date={params.date} />
        <div data-hydrated-param={this.paramHydrated} />
      </div>
    )
  }

}

export default RoutesAndParams;