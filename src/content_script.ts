const tocClassName = 'toc-sidebar'
const tocContentClassName = 'toc-sidebar-content'
const stickyClassName = 'sticky-top'

function getHeadingHref(h: Element) {
    const a = h.querySelector('a.anchor') as HTMLAnchorElement|null
    if (!a) {
      return
    }
    return a.getAttribute('href')
}

function createToC(headings: NodeListOf<Element>) {

  const toc = document.createElement('div')
  const ul = document.createElement('ul')
  toc.appendChild(ul)

  const createLi = (text: string, href: string, headingTag: string) => {
    const li = document.createElement('li')
      const a = document.createElement('a')
      a.setAttribute('href', href)
        const label = document.createElement('div')
        label.classList.add(`toc-label-${headingTag}`)
        label.innerText = text
        a.appendChild(label)
      li.appendChild(a)
    ul.appendChild(li)
  }

  for (const h of headings) {
    const href = getHeadingHref(h)
    if (!href) {
      continue
    }
    createLi((h.textContent || '').trim(), href, h.tagName.toLowerCase())
  }
  return toc
}

function activeTocLinkOnScroll(toc: HTMLDivElement, headings: NodeListOf<Element>) {
    const activeClass = 'active';

    function getLinkByHeading(heading: Element) {
      const href = getHeadingHref(heading);
      if (!href) return
      return toc.querySelector(`a[href="${href}"]`);
    }

    function getOffsetTop(heading: Element) {
      if (!heading.getClientRects().length) {
        return 0;
      }
      let rect = heading.getBoundingClientRect();
      return rect.top
    }

    function activate(heading: Element, lastActiveHeading?: Element) {
      if (lastActiveHeading) {
        getLinkByHeading(lastActiveHeading)?.parentElement!.classList.remove(activeClass);
      }
      getLinkByHeading(heading)?.parentElement!.classList.add(activeClass);
    }

    // active the first heading at the beginning
    let activeHeading: Element = headings[0];
    activate(activeHeading)

    // makes the heading active before it reaches the top of the screen
    const offsetTopBuffer = 60;

    const onScroll = () => {
      const passedHeadings: Array<Element> = [];
      for (const h of headings) {
        if (getOffsetTop(h) < offsetTopBuffer) {
          passedHeadings.push(h)
        } else {
          break;
        }
      }
      let nextActiveHeading = passedHeadings.length > 0 ? passedHeadings[passedHeadings.length - 1] : null
      if (nextActiveHeading && nextActiveHeading != activeHeading) {
        activate(nextActiveHeading, activeHeading)
        activeHeading = nextActiveHeading
      }
    }

    let timer: NodeJS.Timeout|null = null;
    const scrollListener = () => {
      // throttle onScroll call
      if (timer !== null) {
        clearTimeout(timer)
      }
      timer = setTimeout(onScroll, 50)
    }
    document.addEventListener('scroll', scrollListener, false);
}

function main() {
  // check if the url matches \/\w+/\w+$\
  const projectPathRegex = /^\/[\w-]+\/[\w-]+\/?$/gm;
  if (!projectPathRegex.exec(window.location.pathname)) {
    console.log('not a project home path')
    return
  }

  // create section that will be added to sidebar later
  const section = document.createElement('section')
  section.classList.add(tocClassName)

  // create title for section
  const title = document.createElement('h2');
  title.className = 'h4';
  title.textContent = 'Outline';
  section.appendChild(title)

  // get article and headings
  const article = document.querySelector('article') as HTMLElement
  const headings = article.querySelectorAll('h1, h2, h3, h4, h5')

  // create toc
  const toc = createToC(headings)
  toc.classList.add(tocContentClassName)
  section.appendChild(toc)

  // add section to sidebar
  const elSidebarInner = document.querySelector('.Layout-sidebar > div')!
  elSidebarInner.appendChild(section)

  let isSticky = false
  const toggleSticky = (flag: boolean) => {
    if (flag) {
      toc.style.width = `${toc.offsetWidth}px`
      toc.classList.add(stickyClassName)
    } else {
      toc.classList.remove(stickyClassName)
      toc.style.width = 'auto'
    }
    isSticky = flag
  }

  // handle scroll
  const onScroll = () => {
    /* make toc sticky to top when scrolled by */
    const rect = title.getBoundingClientRect();
    // console.log('scroll', rect.top, rect.bottom)
    if (rect.bottom < 0 && !isSticky) {
      // sticky toc
      toggleSticky(true)
    } else if (rect.bottom > 0 && isSticky) {
      // unsticky toc
      toggleSticky(false)
    }
  }

  document.addEventListener('scroll', onScroll)

  // handle
  activeTocLinkOnScroll(toc, headings)
}

main()
