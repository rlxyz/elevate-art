import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class CompilerDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className='min-h-full bg-hue-light'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
          <link
            href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap'
            rel='stylesheet'
          />
          <link rel='stylesheet' type='text/css' href='/font.css' />
        </Head>
        <body className='min-h-full'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CompilerDocument
