describe('TwoWayBindings', () => {

  beforeEach(async () => {
    await page.goto('http://localhost:6969/two-way-bindings?page=1');
  });

  test('inputs can be bound to zero', async () => {
    const element = await page.$('[value="0"]');
    expect(element).toBeTruthy();
  });

  test('bind adds a name attribute to the element', async () => {
    const element = await page.$('[name="number"]');
    expect(element).toBeTruthy();
  });

  test('source can be any object', async () => {
    const value = await page.$eval('[name="page"]', (element) => element.value);
    expect(value).toMatch('1');
  });

  test('source can be any object', async () => {
    const value = await page.$eval('[name="page"]', (element) => element.value);
    expect(value).toMatch('1');
  });

  test('textareas can be bound', async () => {
    const value = await page.$eval('[name="text"]', (element) => element.value);
    expect(value).toMatch('aaaa');
  });

  test('textareas value reflects variable changes', async () => {
    await page.click('[data-textarea]')
    await page.waitForSelector('textarea[data-text="bbbb"]')
    const value = await page.$eval('[name="text"]', (element) => element.value);
    expect(value).toMatch('bbbb');
  });

  test('checkboxes value reflects variable changes', async () => {
    await page.click('[data-checkbox]')
    await page.waitForSelector('input[type=checkbox]:not(:checked)')
    const element = await page.$('input[type=checkbox]:not(:checked)')
    expect(element).toBeTruthy();
  });

  test('select value reflects variable changes', async () => {
    await page.click('[data-select]')
    await page.waitForSelector('[data-character="b"]')
    const value = await page.$eval('select', (element) => element.value);
    expect(value).toMatch('b');
  });

  test('selects can be bound', async () => {
    const value = await page.$eval('[name="character"]', (element) => element.value);
    expect(value).toMatch('a');
  });

  test('binding to undefined sets the value to an empty string', async () => {
    const value = await page.$eval('[data-undeclared]', (element) => element.value);
    expect(value).toMatch('');
  });

  test('checkboxes can be bound', async () => {
    const value = await page.$eval('[name="boolean"]', (element) => element.checked);
    expect(value).toBeTruthy();
  });

  test('objects can be the source of bind', async () => {
    const value = await page.$eval('[name="count"]', (element) => element.value);
    expect(value).toMatch('1');
  });

  test('array indexes can be the source of bind', async () => {
    const value = await page.$eval('[name="0"]', (element) => element.value);
    expect(value).toMatch('a');
  });

  test('custom inputs can be bound', async () => {
    const value = await page.$eval('[data-currency]', (element) => element.value);
    expect(value).toMatch('100,00');
  });

  test('the name can be overwritten', async () => {
    const element = await page.$('[name="boolean-select"]');
    expect(element).toBeTruthy();
  });

  test('selects can bind to boolean attributes', async () => {
    await page.select('[name="boolean-select"]', 'false');
    await page.waitForSelector('[data-boolean-type="boolean"]');
    const element = await page.$('[data-boolean-type="boolean"]');
    expect(element).toBeTruthy();
  });

  test('inputs update the value of variables', async () => {
    await page.type('[name="number"]', '2');
    const value = await page.$eval('[name="number"]', (element) => element.value);
    expect(value).toMatch('2');
  });

  test('bind keeps the primitive type of the variable', async () => {
    await page.type('[name="number"]', '2');
    await page.waitForSelector('[data-number-type="number"]');
    const element = await page.$('[data-number-type="number"]');
    expect(element).toBeTruthy();
  });

  test('bound inputs can have custom events that triger after the value is set', async () => {
    await page.type('[name="number"]', '2');
    await page.waitForSelector('[data-character="b"]');
    const element = await page.$('[data-character="b"]');
    expect(element).toBeTruthy();
  });

  test('developers can create custom bindable components', async () => {
    await page.type('[data-currency]', '696969696969');
    await page.waitForSelector('[data-brings-happiness]')
    const element = await page.$('[data-brings-happiness]');
    expect(element).toBeTruthy();
  });

  test('bind should accept composed computed properties', async () => {
    const value = await page.$eval('[name="composedComputed"]', (element) => element.value);
    expect(value).toMatch('byKeyNameValue');
  });

  test('bind should accept logical computed properties', async () => {
    const value = await page.$eval('[name="logicalComputed"]', (element) => element.value);
    expect(value).toMatch('byKeyNameValue');
  });

  test('bind should accept literal computed properties', async () => {
    const value = await page.$eval('[name="literalComputed"]', (element) => element.value);
    expect(value).toMatch('byKeyNameValue');
  });

  test('bind can be bubbled down', async () => {
    const value = await page.$eval('[name="bubble"]', (element) => element.value);
    expect(value).toMatch('byKeyNameValue');
  });

  test('bind should prerender in external components', async () => {
    const value = await page.$eval('[name="externalComponent"]', (element) => element.value);
    expect(value).toMatch('external');
  });

  test('bind should rerender in external components', async () => {
    await page.type('[data-value]', 'new');
    await page.waitForSelector('[data-value="external"]')
    const value = await page.$eval('[name="externalComponent"]', (element) => element.value);
    expect(value).toMatch('newexternal');
  });

  test('bind can be debounced', async () => {
    await page.type('[data-debounced-bind]', '69');
    await page.waitForTimeout(1000)
    const originalValue = await page.$('[data-debounced-bind="69"]');
    await page.waitForTimeout(1500)
    const updatedValue = await page.$('[data-debounced-bind="6969"]');
    expect(originalValue && updatedValue).toBeTruthy();
  });

  test('object events can be debounced', async () => {
    await page.click('[data-debounced-object]');
    await page.waitForTimeout(1000)
    const originalValue = await page.$('[data-debounced-object="69"]');
    await page.waitForTimeout(1500)
    const updatedValue = await page.$('[data-debounced-object="6969"]');
    expect(originalValue && updatedValue).toBeTruthy();
  });

  test('events can be debounced', async () => {
    await page.click('[data-debounced-event]');
    await page.waitForTimeout(1000)
    const originalValue = await page.$('[data-debounced-event="69"]');
    await page.waitForTimeout(1500)
    const updatedValue = await page.$('[data-debounced-event="6969"]');
    expect(originalValue && updatedValue).toBeTruthy();
  });

  test('debounced events keep the reference to the original event', async () => {
    await page.click('[data-debounced-event]');
    await page.waitForTimeout(1000)
    const originalValue = await page.$('[data-debounced-event="69"]');
    await page.waitForTimeout(1500)
    const updatedValue = await page.$('[data-debounced-event="6969"]');
    expect(originalValue && updatedValue).toBeTruthy();
  });

  test('debounce attribute should not be present in dom during prerender', async () => {
    const element = await page.$('[data-debounced-event]:not([debounce])');
    expect(element).toBeTruthy();
  });

  test('debounce attribute should not be present in dom during render', async () => {
    await page.waitForSelector('[data-debounced-hydrated]')
    const element = await page.$('[data-debounced-hydrated]:not([debounce])');
    expect(element).toBeTruthy();
  });

  test('debounce attribute should not be present in dom during rerender', async () => {
    await page.click('[data-debounced-rerender]:not([debounce])');
    await page.waitForSelector('[data-debounced-rerender="2000"]:not([debounce])')
    const element = await page.$('[data-debounced-rerender="2000"]:not([debounce])');
    expect(element).toBeTruthy();
  });

  test('custom bindable components receive a no op function if no onchange is passed to them', async () => {
    await page.waitForSelector('[data-onchange="noop"]')
    const element = await page.$('[data-onchange="noop"]');
    expect(element).toBeTruthy();
  });

});