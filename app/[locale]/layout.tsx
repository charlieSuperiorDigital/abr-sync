import { Inter } from 'next/font/google'
import './globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { type Locale, routing } from '@/i18n/routing'
import type { NextLayoutProps } from 'next'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'rsuite/dist/rsuite-no-reset.min.css';
import { CustomProvider } from 'rsuite';
import { QueryClientProvider } from '@/app/providers/query-client-provider'
import SessionAuthProvider from '@/app/context/SessionAuthProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  return {
    title: `ABR`,
    description: `My app`,
    openGraph: {
      title: `ABR`,
      description: `ABR`,
      locale: locale,
      type: 'website',
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: NextLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased bg-[#F0FOFO]`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionAuthProvider>
            <QueryClientProvider>
              <CustomProvider>
                {children}
              </CustomProvider>
            </QueryClientProvider>
          </SessionAuthProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
