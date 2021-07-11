import Nullstack from 'nullstack';

class Vunerability extends Nullstack {

  secure = `<script> document.querySelector("[data-secure]").remove() </script>`

  hydrate() {
    this.dangerous = `<b> <script> document.querySelector("[data-secure]").remove(); </script> </b>`
  }
  
  render() {
    return (
      <>
        <div data-secure> {this.secure} </div>
        <div html={this.dangerous} />
      </>
    )
  }

}

export default Vunerability;