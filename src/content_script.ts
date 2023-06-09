const className = 'toc-sidebar'

class TocManager {
  isOut: boolean
  el: Element

  constructor(el: Element) {
    this.isOut = false
    this.el = el
  }

  move(afterEl: Element, isOut: boolean) {
    console.log('move', this.el, 'after', afterEl, isOut)
    afterEl.parentNode?.insertBefore(this.el, afterEl.nextSibling);
    if (isOut) {
      this.el.classList.add(className)
    } else {
      this.el.classList.remove(className)
    }
    this.isOut = isOut
  }
}

function main() {
  const elToc = document.querySelector('#readme details > details-menu')
  if (!elToc) {
    console.log('toc not found')
    return
  }
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
    console.log('scroll', rect.top, rect.bottom)
    if (rect.bottom < 0 && !tocManager.isOut) {
      tocManager.move(elDetailsContainer, true)
    } else if (rect.bottom > 0 && tocManager.isOut) {
      tocManager.move(elTocButton, false)
    }
  }

  document.addEventListener('scroll', onScroll)

  onScroll()
}

main()
