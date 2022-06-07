describe('ArrayAttributes jsx', () => {

  beforeEach(async () => {
    await page.goto('http://localhost:6969/array-attributes');
    await page.waitForSelector('[data-hydrated]')
  });

  test('classes can be simple strings', async () => {
    await page.click('[data-d]');
    await page.waitForSelector('[class="d"]')
    const element = await page.$('[class="d"]')
    expect(element).toBeTruthy();
  });

  test('when class refers to an array the result is the merge of the strings', async () => {
    await page.click('[data-ab]');
    await page.waitForSelector('[class="a b"]')
    const element = await page.$('[class="a b"]')
    expect(element).toBeTruthy();
  });

  test('when the class array changes the attribute changes', async () => {
    await page.click('[data-ab]');
    await page.waitForSelector('[class="a b"]')
    await page.click('[data-abc]');
    await page.waitForSelector('[class="a b c"]')
    const element = await page.$('[class="a b c"]')
    expect(element).toBeTruthy();
  });

  test('falsy values are removed from the class array', async () => {
    await page.click('[data-e]');
    await page.waitForSelector('[class="e"]')
    const element = await page.$('[class="e"]')
    expect(element).toBeTruthy();
  });

  test('styles can be simple strings', async () => {
    await page.click('[data-purple]');
    await page.waitForSelector('[style="color: purple;"]')
    const element = await page.$('[style="color: purple;"]')
    expect(element).toBeTruthy();
  });

  test('when style refers to an array the result is the merge of the strings', async () => {
    await page.click('[data-pink-blue]');
    await page.waitForSelector('[style="color: pink; background-color: blue;"]')
    const element = await page.$('[style="color: pink; background-color: blue;"]')
    expect(element).toBeTruthy();
  });

  test('when the style array changes the attribute changes', async () => {
    await page.click('[data-pink-blue]');
    await page.waitForSelector('[style="color: pink; background-color: blue;"]')
    await page.click('[data-pink-blue-red]');
    await page.waitForSelector('[style="color: pink; background-color: blue; border: 1px solid red;"]')
    const element = await page.$('[style="color: pink; background-color: blue; border: 1px solid red;"]')
    expect(element).toBeTruthy();
  });

  test('falsy values are removed from the style array', async () => {
    await page.click('[data-green]');
    await page.waitForSelector('[style="color: green;"]')
    const element = await page.$('[style="color: green;"]')
    expect(element).toBeTruthy();
  });

  test('when events point to an array all the functions are executed in parallel', async () => {
    await page.click('[data-events]');
    await page.waitForSelector('[data-count="4"]')
    const element = await page.$('[data-count="4"]')
    expect(element).toBeTruthy();
  });

  test('object events can be mixed with function events in arrays', async () => {
    await page.click('[data-events]');
    await page.waitForSelector('[data-count="4"][data-objected]')
    const element = await page.$('[data-count="4"][data-objected]')
    expect(element).toBeTruthy();
  });

});
