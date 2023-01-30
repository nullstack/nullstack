import Nullstack from 'nullstack'

import TwoWayBindingsExternalComponent from './TwoWayBindingsExternalComponent'

class TwoWayBindings extends Nullstack {

  number = 1;
  currency = 100
  boolean = true
  character = 'a'
  text = 'aaaa'

  object = { count: 1 }
  array = ['a', 'b', 'c']

  byKeyName = 'byKeyNameValue'
  keyName = 'byKeyName'

  zero = 0

  bringsHappiness = false

  external = 'external'

  debouncedBind = '69'
  debouncedObject = '69'
  debouncedEvent = '69'
  debounceTime = 1000

  textareaDisabled = false

  parse({ event, source: bind, callback }) {
    const normalized = event.target.value.replace(',', '').padStart(3, '0')
    const whole = (parseInt(normalized.slice(0, -2)) || 0).toString()
    const decimal = normalized.slice(normalized.length - 2)
    const value = parseFloat(`${whole}.${decimal}`)
    const bringsHappiness = value >= 1000000
    bind.object[bind.property] = value
    callback({ bringsHappiness })
  }

  renderCurrencyInput({ bind, onchange }) {
    const formatted = bind.object[bind.property].toFixed(2).replace('.', ',')
    return <input data-currency source={bind} value={formatted} oninput={this.parse} callback={onchange} />
  }

  renderBubble({ bind }) {
    return <input name="bubble" bind={bind} />
  }

  updateCharacter({ value }) {
    this.character = this.array[value]
  }

  setHappiness({ bringsHappiness }) {
    this.bringsHappiness = bringsHappiness
  }

  debouncedEventHandler({ event }) {
    if (event.type === 'click') {
      this.debouncedEvent = '6969'
    }
  }

  render({ params }) {
    return (
      <div data-brings-happiness={this.bringsHappiness} data-hydrated={this.hydrated}>
        <input bind={this.zero} name="zero" />
        <div data-number={this.number} />
        {!this.boolean && <div data-boolean-type={typeof this.boolean} />}
        {this.number > 1 && <div data-number-type={typeof this.number} />}
        <input bind={this.number} name="number" oninput={this.updateCharacter} />
        <textarea bind={this.text} name="text" disabled={this.textareaDisabled} />
        <button onclick={{ text: 'bbbb' }} data-textarea data-text={this.text}>
          textarea b
        </button>
        <button onclick={{ textareaDisabled: true }} data-textarea-disabled>
          textarea disable
        </button>
        <div data-character={this.character} />
        <select bind={this.character} name="character">
          {this.array.map((character) => (
            <option>{character}</option>
          ))}
        </select>
        <button onclick={{ character: 'b' }} data-select>
          select b
        </button>
        <select bind={this.boolean} name="boolean-select">
          <option value>true</option>
          <option value={false}>false</option>
        </select>
        <input bind={this.boolean} name="boolean" type="checkbox" />
        <button onclick={{ boolean: false }} data-checkbox>
          boolean false
        </button>
        <input bind={this.object.count} name="count" />
        <input bind={this.undeclared} name="undeclared" data-undeclared />
        <input bind={this.undeclared?.nested} name="undeclared-nested" data-undeclared-nested />
        <textarea bind={this.undeclaredTextarea} name="undeclared" data-undeclared />
        <textarea bind={this.undeclaredTextarea?.nested} name="undeclared-nested" data-undeclared-nested />
        <input bind={this[this.keyName]} name="composedComputed" />
        <input bind={this[['by', 'Key', 'Name'].join('')]} name="logicalComputed" />
        <input bind={this.byKeyName} name="literalComputed" />
        {this.array.map((value, index) => (
          <input bind={this.array[index]} name={index.toString()} />
        ))}
        <input bind={params.page} name="page" />
        <Bubble bind={this.byKeyName} />
        <CurrencyInput bind={this.currency} onchange={this.setHappiness} />
        <TwoWayBindingsExternalComponent bind={this.external} />
        <input bind={this.debouncedBind} debounce={2000} data-debounced-bind={this.debouncedBind} />
        <button onclick={{ debouncedObject: '6969' }} debounce={2000} data-debounced-object={this.debouncedObject}>
          {' '}
          debounce object{' '}
        </button>
        <button onclick={this.debouncedEventHandler} debounce={2000} data-debounced-event={this.debouncedEvent}>
          {' '}
          debounce event{' '}
        </button>
        {this.hydrated && <input bind={this.debouncedBind} debounce={2000} data-debounced-hydrated />}
        <input
          onclick={{ clicked: true }}
          oninput={{ inputed: true }}
          data-rerender-clicked-and-inputed={this.clicked && this.inputed}
          data-rerender-click-and-input
        />
        <button onclick={{ renderInput: true }} data-render-input>
          rerender
        </button>
        {this.renderInput && (
          <input
            onclick={{ clicked: true }}
            oninput={{ inputed: true }}
            data-render-clicked-and-inputed={this.clicked && this.inputed}
            data-render-click-and-input
          />
        )}
        <button
          onclick={{ debounceTime: 2000 }}
          debounce={this.debounceTime}
          data-debounced-rerender={this.debounceTime}
        >
          rebounce
        </button>
      </div>
    )
  }

}

export default TwoWayBindings
