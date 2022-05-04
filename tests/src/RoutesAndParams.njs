import Nullstack from 'nullstack';
class RoutesAndParams extends Nullstack {

  paramHydrated = false;

  hydrate(context) {
    const { router, params } = context;
    this.paramHydrated = params.id === 'a';
    window.addEventListener(router.event, () => {
      context.eventTriggered = true;
    });
  }

  renderOther({ params }) {
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

  renderInnerHTML() {
    const html = `<a href="/routes-and-params/inner-html">a</a>`
    return (
      <div>
        <button data-html-click data-html-clicked={this.clickedHTML} onclick={{ clickedHTML: true }}>click html</button>
        <button onclick={{ updatedHTML: true }} data-update-initial-html>update html</button>
        <div data-initial-html html={this.updatedHTML ? html + html : html} />
        <button onclick={{ visibleHTML: true }} data-show-conditional-html>show html</button>
        {this.visibleHTML && <div data-conditional-html html={html} />}
      </div>
    )
  }

  setParamsDate({ params }) {
    params.date = new Date('1992-10-16');
  }

  goToDocs({ router }) {
    router.url = 'https://nullstack.app';
  }

  render({ router, params, eventTriggered, self }) {
    return (
      <div>
        <a href="https://nullstack.app"> Nullstack</a>
        <button data-absolute onclick={this.goToDocs}> Nullstack </button>
        <a href="/routes-and-params/no-hash#hash">hash</a>
        <div data-hydrated={self.hydrated} data-event-triggered={eventTriggered} />
        <div data-router={!!router} />
        <div route="/routes-and-params" data-route="/routes-and-params" />
        <InnerHTML route="/routes-and-params/inner-html" />
        <Other route="/routes-and-params/:id" />
        <Wildcard route="/routes-and-params/*" />
        <a href="/routes-and-params/a"> a </a>
        <a params={{ framework: 'nullstack' }}> string </a>
        <a path="/routes-and-params/d"> path </a>
        <div data-url={router.url} />
        <div data-path={router.path} />
        <div data-base={router.base} />
        <div data-empty={params.empty} />
        <div data-boolean={params.boolean} />
        <button data-params onclick={this.setParamsDate}> date </button>
        <div data-date={params.date} />
        <div data-hydrated-param={this.paramHydrated} />
        <div data-previous={String(router.previous)} />
      </div>
    )
  }

}

export default RoutesAndParams;