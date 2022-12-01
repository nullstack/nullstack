import Nullstack from 'nullstack'

class CommponentA extends Nullstack {

  render() {
    return <p data-a> A </p>
  }

}

class CommponentB extends Nullstack {

  render() {
    return <p data-b> B </p>
  }

}

class ComponentTernary extends Nullstack {

  showA = true

  render() {
    return (
      <div>
        {this.showA ? <CommponentA /> : <CommponentB />}
        <button onclick={{ showA: !this.showA }}> ab </button>
      </div>
    )
  }
}

export default ComponentTernary
