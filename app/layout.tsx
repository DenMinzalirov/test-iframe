import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HertzBetz Casino - Registration',
  description: 'Join HertzBetz Casino and claim 200% up to 1000 EUR + 150 Free Spins',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <script 
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ti6rsv5fd8");
            `
          }}
        />
      </head>
      <body className="bg-gray-900 m-0 p-0">
        {children}
      </body>
    </html>
  )
}
