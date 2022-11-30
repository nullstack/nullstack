import Nullstack from 'nullstack'

class ClassRoute extends Nullstack {

  render() {
    return (
      <div>
        <a href="#bottom">#bottom</a>
        <div style="height: 3000px;">big ass div in a class</div>
        <div id="bottom" style="height: 3000px;">
          bottom div
        </div>
      </div>
    )
  }

}

function FunctionalRoute() {
  return <div style="height: 3000px;"> big ass div in a function </div>
}

class RouteScroll extends Nullstack {

  render({ params }) {
    return (
      <div>
        <ClassRoute route="/route-scroll/class" key={(!!params.changed).toString()} />
        <FunctionalRoute route="/route-scroll/function" />
        <a href="/route-scroll?changed=1">1</a>
        <a href="/route-scroll?changed=2">2</a>
        <a href="/route-scroll">false</a>
      </div>
    )
  }
}

export default RouteScroll
