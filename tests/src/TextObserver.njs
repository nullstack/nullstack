import Nullstack from 'nullstack';

class TextObserver extends Nullstack {

  unmutatedText = 'default'
  mutatedText = 'default'

  hydrate() {
    const config = {
      characterData: true,
      childList: true,
      subtree: true,
    };
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        mutation.target.parentElement.dataset.mutated = true
      }
      observer.disconnect();
    });
    for (const element of [...document.querySelectorAll('[data-text-observer]')]) {
      observer.observe(element, config);
    }
    this.mutatedText = 'mutated'
  }

  render() {
    return (
      <div>
        <span data-text-observer data-regular-text> regular text </span>
        <span data-text-observer data-unmutated-text> {this.unmutatedText} </span>
        <span data-text-observer data-mutated-text onclick={{ mutatedText: 'hi' }}> {this.mutatedText} </span>
      </div>
    )
  }

}

export default TextObserver;