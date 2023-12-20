const tocClassName = 'toc-sidebar'
const tocContentClassName = 'toc-sidebar-content'
const stickyClassName = 'sticky-top'

function createToC() {
  const article = document.querySelector('article') as HTMLElement
  const headings = article.querySelectorAll('h1, h2, h3, h4, h5')

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
    const a = h.querySelector('a.anchor') as HTMLAnchorElement|null
    if (!a) {
      continue
    }
    const href = a.getAttribute('href')!
    createLi((h.textContent || '').trim(), href, h.tagName.toLowerCase())
  }
  return toc
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

  // create toc
  const toc = createToC()
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
}

main()
