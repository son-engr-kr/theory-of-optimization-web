import katex from 'katex'

export function InlineMath({ math }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    strict: 'ignore',
    output: 'html'
  })
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function BlockMath({ math }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    strict: 'ignore',
    displayMode: true,
    output: 'html'
  })
  return <div className="katex-display" dangerouslySetInnerHTML={{ __html: html }} />
}


