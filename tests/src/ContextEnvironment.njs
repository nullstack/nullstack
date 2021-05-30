import Nullstack from 'nullstack';

class ContextEnvironment extends Nullstack {
  
  render({environment}) {
    return (
      <div>
        <div data-environment={!!environment} />
        <div data-client={environment.client.toString()} />
        <div data-server={environment.server.toString()} />
        <div data-development={environment.development.toString()} />
        <div data-production={environment.production.toString()} />
        <div data-static={(environment.mode === 'ssg').toString()} />
        <div data-key={environment.key} />
      </div>
    )
  }

}

export default ContextEnvironment;