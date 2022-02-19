import Nullstack from 'nullstack';

class RoutesAndParams extends Nullstack {

  eventTriggered = false;
  paramHydrated = false;
  innerHTMLData = {
    shownLink: true,
    btnText: '',
    doubleLink: false
  };

  hydrate(context) {
    const { router, params } = context;
    this.paramHydrated = params.id === 'a';
    window.addEventListener(router.event, () => {
      context.eventTriggered = true;
    });
    this.innerHTMLData.shownLink = !params.hideLink;
    this.innerHTMLData.btnText = 'click';
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

  renderInnerHTML({ params, route }) {
    const hideLinkParam = params.hideLink ? '?hideLink=true' : '';
    const link = (dataset = '') => `
      <a href="${route}${hideLinkParam}" ${dataset}>innerHTML</a>
    `
    const doubleLink = link() + link('data-link2');
    const html = !this.innerHTMLData.doubleLink ? link() : doubleLink;
    const updateHTMLData = (newVal) => () => {
      this.innerHTMLData = { ...this.innerHTMLData, ...newVal };
    }

    return (
      <div>
        <button
          onclick={updateHTMLData({ btnText: 'clicked', shownLink: true })}
          data-show-link={this.innerHTMLData.btnText}
          html={this.innerHTMLData.btnText}
        />
        <button
          onclick={updateHTMLData({ doubleLink: true })}
          data-double-link
          html="doubleLinks"
        />
        <div html={this.innerHTMLData.shownLink ? html : ''} />
      </div>
    )
  }

  setParamsDate({ params }) {
    params.date = new Date('1992-10-16');
  }

  goToDocs({ router }) {
    router.url = 'https://nullstack.app';
  }

  render({ router, params, eventTriggered }) {
    return (
      <div>
        <a href="https://nullstack.app"> Nullstack</a>
        <button data-absolute onclick={this.goToDocs}> Nullstack </button>
        <a href="/routes-and-params/no-hash#hash">hash</a>
        <div data-event-triggered={eventTriggered} />
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