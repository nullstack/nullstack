beforeAll(async () => {
  await page.on('dialog', async (dialog) => {
    await dialog.dismiss()
  })
})

describe('RoutesAndParams /routes-and-params', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params')
  })

  test('router has a base key', async () => {
    const element = await page.$('[data-base="https://localhost:6969"]')
    expect(element).toBeTruthy()
  })

  test('is part of the client environment', async () => {
    const element = await page.$('[data-router]')
    expect(element).toBeTruthy()
  })

  test('routes match once per depth', async () => {
    const element = await page.$('[data-route="/routes-and-params"]')
    expect(element).toBeTruthy()
  })

  test('entering a route stops other routes on same depth', async () => {
    const element = await page.$('[data-other]')
    expect(element).toBeFalsy()
  })

  test('params keys return empty keys by default', async () => {
    const element = await page.$('[data-empty]')
    expect(element).toBeTruthy()
  })

  test('a tags can generate the href from params', async () => {
    const element = await page.$('[href="/routes-and-params?framework=nullstack"]')
    expect(element).toBeTruthy()
  })

  test('assignments to params convert the value to JSON', async () => {
    await page.click('[data-params]')
    await page.waitForSelector('[data-date="1992-10-16T00:00:00.000Z"]')
    const element = await page.$('[data-date="1992-10-16T00:00:00.000Z"]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/a', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params')
    await page.click('[href="/routes-and-params/a"]')
    await page.waitForSelector('[data-a]')
  })

  test('a tags update the router url', async () => {
    const element = await page.$('[data-a]')
    expect(element).toBeTruthy()
  })

  test('params are available when coming from external', async () => {
    await page.goto('http://localhost:6969/')
    await page.click('[href="/routes-and-params/a"]')
    await page.waitForSelector('[data-hydrated-param]')
    const element = await page.$('[data-hydrated-param]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams event', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/')
    await page.click('[href="/routes-and-params/a"]')
    await page.waitForSelector('[data-hydrated]')
    await page.click('[href="/routes-and-params/a?framework=nullstack"]')
  })

  test('a custom event is triggered when the url changes', async () => {
    await page.waitForSelector('[data-event-triggered]')
    const element = await page.$('[data-event-triggered]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/?boolean=true', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/?boolean=true')
  })

  test('params with value of true are converted to boolean', async () => {
    const element = await page.$('[data-boolean]')
    expect(element).toBeTruthy()
  })

  test('a tags can assign directly to path', async () => {
    const element = await page.$('[href="/routes-and-params/d?boolean=true"]')
    expect(element).toBeTruthy()
  })

  test('router url removes the leading slash', async () => {
    const element = await page.$('[data-url="/routes-and-params?boolean=true"]')
    expect(element).toBeTruthy()
  })

  test('router path removes the leading slash', async () => {
    const element = await page.$('[data-path="/routes-and-params"]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params?boolean=false', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params?boolean=false')
  })

  test('params with value of false are converted to boolean', async () => {
    const element = await page.$('[data-boolean]')
    expect(element).toBeFalsy()
  })
})

describe('RoutesAndParams /routes-and-params/c', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/c')
  })

  test('wildcards are matched last', async () => {
    const element = await page.$('[data-id="c"]')
    expect(element).toBeTruthy()
  })

  test('dynamic segments are assigned to params', async () => {
    const element = await page.$('[data-id="c"]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/c', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/c/a')
  })

  test('wildcards can be prefixed', async () => {
    const element = await page.$('[data-wildcard]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/d?boolean=true#hash ssr', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/d?boolean=true#hash')
  })

  test('hash is not part of the router url', async () => {
    const element = await page.$('[data-url="/routes-and-params/d?boolean=true"]')
    expect(element).toBeTruthy()
  })

  test('hash is not part of the router path', async () => {
    const element = await page.$('[data-path="/routes-and-params/d"]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/d?boolean=true#hash spa', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/d?boolean=true#hash')
    await page.click('[href="/routes-and-params/no-hash#hash"]')
    await page.waitForSelector('[data-url="/routes-and-params/no-hash"]')
  })

  test('hash is not part of the router url', async () => {
    const element = await page.$('[data-url="/routes-and-params/no-hash"]')
    expect(element).toBeTruthy()
  })

  test('hash is not part of the router path', async () => {
    const element = await page.$('[data-path="/routes-and-params/no-hash"]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params')
  })

  test('a with absolute hrefs cause a hard redirect', async () => {
    await page.click('[data-absolute]')
    await page.waitForSelector('[href="/contributors"]')
    const url = await page.url()
    expect(url).toMatch('https://nullstack.app')
  })
})

describe('RoutesAndParams /routes-and-params?previous=true', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params?previous=true')
  })

  test('router previous key starts null', async () => {
    const element = await page.$('[data-previous="null"]')
    expect(element).toBeTruthy()
  })

  test('router previous is assigned with the old router url when route updates', async () => {
    await page.click('[href="/routes-and-params?framework=nullstack"]')
    await page.waitForSelector('[data-previous="/routes-and-params?previous=true"]')
    const element = await page.$('[data-previous="/routes-and-params?previous=true"]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/inner-html', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/inner-html')
    await page.click('[data-html-click]')
  })

  test('html route injected from start do not refresh', async () => {
    await page.click('[data-initial-html] a')
    await page.waitForSelector(`[data-html-clicked]`)
    const element = await page.$('[data-html-clicked]')
    expect(element).toBeTruthy()
  })

  test('html route injected after first render do not refresh', async () => {
    await page.click('[data-show-conditional-html]')
    await page.waitForSelector(`[data-conditional-html] a`)
    await page.click('[data-conditional-html] a')
    await page.waitForSelector(`[data-html-clicked]`)
    const element = await page.$('[data-html-clicked]')
    expect(element).toBeTruthy()
  })

  test('html route added beside existent do not refresh', async () => {
    await page.click('[data-update-initial-html]')
    await page.waitForSelector(`[data-initial-html] a:nth-child(2)`)
    await page.click('[data-initial-html] a:nth-child(2)')
    await page.waitForSelector(`[data-html-clicked]`)
    const element = await page.$('[data-html-clicked]')
    expect(element).toBeTruthy()
  })
})

describe('RoutesAndParams /routes-and-params/hrefs spa', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:6969/routes-and-params/hrefs')
  })

  test('https urls do a full redirect', async () => {
    await Promise.all([page.click('[href="https://nullstack.app/"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toMatch('://nullstack.app')
  })

  test('http urls do a full redirect', async () => {
    await Promise.all([page.click('[href="http://nullstack.app/"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toMatch('://nullstack.app')
  })

  test('// urls do a full redirect', async () => {
    await Promise.all([page.click('[href="//nullstack.app/"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toMatch('://nullstack.app')
  })

  // test('ftp urls do not redirect', async () => {
  //   await page.click('[href="ftp://nullstack.app/"]'),
  //   await page.waitForSelector('[data-ftp-clicked]');
  //   const element = await page.$('[data-ftp-clicked]');
  //   expect(element).toBeTruthy();
  // });

  // test('tel urls do not redirect', async () => {
  //   await page.click('[href="tel:1555696969"]'),
  //   await page.waitForSelector('[data-tel-clicked]');
  //   const element = await page.$('[data-tel-clicked]');
  //   expect(element).toBeTruthy();
  // });

  // test('mailto urls do not redirect', async () => {
  //   await page.click('[href="mailto:contact@nullstack.app"]'),
  //   await page.waitForSelector('[data-mailto-clicked]');
  //   const element = await page.$('[data-mailto-clicked]');
  //   expect(element).toBeTruthy();
  // });

  test('relative urls redirect', async () => {
    await Promise.all([page.click('[href="relative"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/routes-and-params/relative')
  })

  test('relative composed urls redirect', async () => {
    await Promise.all([page.click('[href="relative/6969"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/routes-and-params/relative/6969')
  })

  test('root urls redirect', async () => {
    await Promise.all([page.click('[href="/root/6969"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/root/6969')
  })

  test('current urls redirect', async () => {
    await Promise.all([page.click('[href="./current"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/routes-and-params/current')
  })

  test('parent urls redirect', async () => {
    await Promise.all([page.click('[href="../parent"]'), page.waitForNavigation()])
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/parent')
  })
})

// describe('RoutesAndParams /routes-and-params/hrefs ssr', () => {

//   test('ssr parent', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?parent=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/parent');
//   });

//   test('ssr current', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?current=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/routes-and-params/current');
//   });

//   test('ssr https', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?https=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('https://nullstack.app/');
//   });

//   test('ssr http', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?http=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/http');
//   });

//   test('ssr same', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?same=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/routes-and-params/href-same-protocol');
//   });

//   // test.skip('ssr ftp', async () => {
//   //   await Promise.all([
//   //     page.goto('http://localhost:6969/routes-and-params/hrefs?ftp=1'),
//   //     page.waitForNavigation(),
//   //   ]);
//   //   const url = await page.url();
//   //   expect(url).toEqual('https://nullstack.app/');
//   // });

//   // test.skip('ssr tel', async () => {
//   //   await Promise.all([
//   //     page.goto('http://localhost:6969/routes-and-params/hrefs?tel=1'),
//   //     page.waitForNavigation(),
//   //   ]);
//   //   const url = await page.url();
//   //   expect(url).toEqual('https://nullstack.app/');
//   // });

//   // test.skip('ssr mailto', async () => {
//   //   await Promise.all([
//   //     page.goto('http://localhost:6969/routes-and-params/hrefs?mailto=1'),
//   //     page.waitForNavigation(),
//   //   ]);
//   //   const url = await page.url();
//   //   expect(url).toEqual('https://nullstack.app/');
//   // });

//   test('ssr relative', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?relative=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/routes-and-params/relative');
//   });

//   test('ssr relativeComposed', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?relativeComposed=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/routes-and-params/relative/6969');
//   });

//   test('ssr root', async () => {
//     await Promise.all([
//       page.goto('http://localhost:6969/routes-and-params/hrefs?root=1'),
//       page.waitForNavigation(),
//     ]);
//     const url = await page.url();
//     expect(url).toEqual('http://localhost:6969/root/6969');
//   });

// });
