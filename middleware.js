import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('auth_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register')

  // If trying to access auth pages while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected pages without auth, redirect to login
  if (!isAuthPage && !token && !request.nextUrl.pathname.startsWith('/checkout')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/produtos/:path*',
    '/vendas/:path*',
    '/pagamentos/:path*',
    '/painel/:path*',
    '/integracoes/:path*',
    '/configuracoes/:path*',
    '/clientes/:path*',
    '/login',
    '/register'
  ]
} 