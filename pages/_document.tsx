import Document, { Html, Head, Main, NextScript } from 'next/document'

class CompilerDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className='h-full bg-hue-light'>
        <Head>
          <link
            rel='reload'
            href='https://rlxyz.nyc3.cdn.digitaloceanspaces.com'
          />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin='true'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap'
            rel='stylesheet'
          />
          <link rel='stylesheet' type='text/css' href='/font.css' />
        </Head>
        <body className='h-full'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CompilerDocument
