import Nullstack from 'nullstack'

class ContextPage extends Nullstack {

  eventTriggered = false;

  prepare({ page }) {
    page.title = 'Nullstack Tests'
    page.image = '/image.jpg'
    page.description = 'Nullstack tests page that tests the context page'
    page.locale = 'pt-BR'
    page.robots = 'index, follow'
    page.schema = {
      '@type': 'WebSite',
      '@id': '#website',
      name: 'Nullstack',
      url: 'https://nullstack.app',
    }
    page.changes = 'weekly'
    page.priority = 1
  }

  hydrate({ page }) {
    window.addEventListener(page.event, () => {
      this.eventTriggered = true
    })
  }

  static async raiseStatus({ response, status }) {
    response.status(401)
    return status
  }

  async requestStatus({ status }) {
    await this.raiseStatus({ status })
  }

  updateHead({ page }) {
    page.title = 'Nullstack Tests Updated'
    page.image = '/image-updated.jpg'
    page.description = 'Nullstack tests page that tests the context page updated'
    page.locale = 'en-US'
  }

  render({ page }) {
    return (
      <div>
        <div data-event-triggered={this.eventTriggered} />
        <div data-page={!!page} />
        <div data-changes={page.changes} />
        <div data-priority={page.priority} />
        <button onclick={this.requestStatus} data-request-status>
          401
        </button>
        <button source={page} onclick={this.updateHead} data-update-head>
          title
        </button>
      </div>
    )
  }

}

export default ContextPage
