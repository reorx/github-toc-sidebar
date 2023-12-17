const className = 'toc-sidebar'

class TocManager {
  isShown: boolean
  el: Element

  constructor(el: Element) {
    this.isShown = false
    this.el = el
  }

  moveAfter(afterEl: Element, isShown: boolean) {
    console.log('move', this.el, 'after', afterEl, isShown)
    afterEl.parentNode?.insertBefore(this.el, afterEl.nextSibling);
    this.show(isShown)
  }

  moveIn(inEl: Element, isShown: boolean) {
    console.log('move', this.el, 'in', inEl, isShown)
    inEl.appendChild(this.el)
    this.show(isShown)
  }

  show(isShown: boolean) {
    if (isShown) {
      this.el.classList.add(className)
    } else {
      this.el.classList.remove(className)
    }
    this.isShown = isShown
  }
}

function handleOldReadme(elToc: Element) {
  console.log(`handle toc for "New Repository Overview" disabled`)
  /* Normal structure:
  <elDetailsContainer>
    <elDetails>
      <elTocButton/>
      <elToc/>
    </elDetails>
  </elDetailsContainer>

  Sidebar structure:
  <elDetailsContainer>
    <elDetails>
      <elTocButton/>
    </elDetails>
  </elDetailsContainer>
  <elToc/>
  */
  const elDetails = document.querySelector('#readme details')!
  const elDetailsContainer = elDetails.parentElement!
  const elTocButton = document.querySelector('#readme details > summary')!

  const elSidebarInner = document.querySelector('.Layout-sidebar > div')!
  const elSidebarInnerLast = elSidebarInner.lastElementChild!

  const tocManager = new TocManager(elToc)

  const onScroll = () => {
    const rect = elSidebarInnerLast!.getBoundingClientRect();
    // console.log('scroll', rect.top, rect.bottom)
    if (rect.bottom < 0 && !tocManager.isShown) {
      // show toc, move it besides elDetailsContainer
      tocManager.moveAfter(elDetailsContainer, true)
    } else if (rect.bottom > 0 && tocManager.isShown) {
      // hide toc, move it besides elTocButton
      tocManager.moveAfter(elTocButton, false)
    }
  }

  document.addEventListener('scroll', onScroll)

  onScroll()
}

function handleNewReadme() {
  console.log(`handle toc for "New Repository Overview" enabled`)
  /*
  New Repository Overview uses react portal to control the toc position, the structure is like:

  div#__primerPortalRoot__
    div
      div.Overlay__StyledOverlay-sc-51280t-0.jQOpaI
        div
          section(aria-labelledby="outline-id")
  */
  const elToc = document.querySelector('section[aria-labelledby="outline-id"]')
  if (!elToc) {
    console.warn('no toc found for "New Repository Overview" enabled')
    return
  }
  const cloned = elToc.cloneNode(true) as Element
  cloned.classList.add('toc-cloned')
  cloned.removeAttribute('aria-labelledby')

  const tocButton = document.querySelector('button[aria-label="Outline"]')
  tocButton!.parentNode!.appendChild(cloned)

  //const elTocContainer = elToc.parentElement!

  const elSidebarInner = document.querySelector('.Layout-sidebar > div')!
  const elSidebarInnerLast = elSidebarInner.lastElementChild!
  console.log('inner last', elSidebarInnerLast)

  const tocManager = new TocManager(cloned)


  const onScroll = () => {
    const rect = elSidebarInnerLast!.getBoundingClientRect();
    // console.log('scroll', rect.top, rect.bottom)
    if (rect.bottom < 0 && !tocManager.isShown) {
      // show toc
      tocManager.show(true)
    } else if (rect.bottom > 0 && tocManager.isShown) {
      // hide toc
      tocManager.show(false)
    }
  }

  document.addEventListener('scroll', onScroll)
}

const addCSS = (css: string) => {
  const styleElement: HTMLStyleElement = document.createElement('style');
  document.head.appendChild(styleElement);
  const sheet: CSSStyleSheet = styleElement.sheet as CSSStyleSheet;
  sheet.insertRule(css, sheet.cssRules.length);
};

function main() {
  // check if the url matches \/\w+/\w+$\
  const projectPathRegex = /^\/[\w-]+\/[\w-]+\/?$/gm;
  if (!projectPathRegex.exec(window.location.pathname)) {
    console.log('not a project home path')
    return
  }


  let elToc = document.querySelector('#readme details > details-menu')

  if (elToc) {
    handleOldReadme(elToc)
  } else {

    console.log('try for New Repository Overview enabled')
    const tocButton = document.querySelector('button[aria-label="Outline"]')
    if (!tocButton) {
      console.warn('toc button not found, skip')
      return
    }
    addCSS('section[aria-labelledby="outline-id"] { display: none; }')
    setTimeout(() => {
      (tocButton as HTMLButtonElement).click()
      setTimeout(handleNewReadme, 100)
    }, 500)
  }
}

main()
