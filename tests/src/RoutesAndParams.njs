import Nullstack from 'nullstack';
class RoutesAndParams extends Nullstack {

  paramHydrated = false;

  initiate({ router, params }) {
    if (params.parent) {
      router.url = '../parent'
    } else if (params.current) {
      router.url = './current'
    } else if (params.https) {
      router.url = 'https://nullstack.app/'
    } else if (params.http) {
      router.url = 'http://localhost:6969/http'
    } else if (params.same) {
      router.url = '//localhost:6969/routes-and-params/href-same-protocol'
    } else if (params.ftp) {
      router.url = 'ftp://nullstack.app/'
    } else if (params.tel) {
      router.url = 'tel:1555696969'
    } else if (params.mailto) {
      router.url = 'mailto:contact@nullstack.app'
    } else if (params.relative) {
      router.url = 'relative'
    } else if (params.relativeComposed) {
      router.url = 'relative/6969'
    } else if (params.root) {
      router.url = '/root/6969'
    }
  }

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

  renderHrefs() {
    return (
      <>
        <a href="https://nullstack.app/"> Nullstack HTTPS</a>
        <a href="http://nullstack.app/"> Nullstack HTTP</a>
        <a href="//nullstack.app/"> Nullstack SAME</a>
        <a href="ftp://nullstack.app/" data-ftp-clicked={this.clickedFtp} onclick={{ clickedFtp: true }}> Nullstack FTP</a>
        <a href="tel:1555696969" data-tel-clicked={this.clickedTel} onclick={{ clickedTel: true }}> Nullstack TEL</a>
        <a href="mailto:contact@nullstack.app" data-mailto-clicked={this.clickedMailTo} onclick={{ clickedMailTo: true }}> Nullstack MAILTO</a>
        <a href="relative"> Nullstack RELATIVE</a>
        <a href="relative/6969"> Nullstack RELATIVE TWO</a>
        <a href="/root/6969"> Nullstack ROOT</a>
        <a href="./current"> Nullstack CURRENT DIR</a>
        <a href="../parent"> Nullstack PARENT DIR</a>
      </>
    )
  }

  render({ router, params, eventTriggered }) {
    return (
      <div>
        <Hrefs />
        <button data-absolute onclick={this.goToDocs}> Nullstack </button>
        <a href="/routes-and-params/no-hash#hash">hash</a>
        <div data-hydrated={this.hydrated} data-event-triggered={eventTriggered} />
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