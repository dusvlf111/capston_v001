## Error Type
Console Error

## Error Message
D:\workspace\capston_v001\.next\dev\server\chunks\ssr\node_modules_ec31804d._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at createServerComponentSupabaseClient (src\lib\supabase\server.ts:6:37)
    at Header (src\components\layout\Header.tsx:13:55)
    at RootLayout (src\app\layout.tsx:47:11)

## Code Frame
  4 |
  5 | export function createServerComponentSupabaseClient() {
> 6 |   return createServerComponentClient<Database>({ cookies });
    |                                     ^
  7 | }
  8 |
  9 | export function createRouteHandlerSupabaseClient() {

Next.js version: 16.0.3 (Turbopack)

## Error Type
Console Error

## Error Message
D:\workspace\capston_v001\.next\dev\server\chunks\ssr\[root-of-the-server]__27bfbd78._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at createServerComponentSupabaseClient (src\lib\supabase\server.ts:6:37)
    at Header (src\components\layout\Header.tsx:13:55)
    at RootLayout (src\app\layout.tsx:47:11)

## Code Frame
  4 |
  5 | export function createServerComponentSupabaseClient() {
> 6 |   return createServerComponentClient<Database>({ cookies });
    |                                     ^
  7 | }
  8 |
  9 | export function createRouteHandlerSupabaseClient() {

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console TypeError

## Error Message
nextCookies.get is not a function


    at createServerComponentSupabaseClient (src\lib\supabase\server.ts:6:37)
    at Header (src\components\layout\Header.tsx:13:55)
    at RootLayout (src\app\layout.tsx:47:11)

## Code Frame
  4 |
  5 | export function createServerComponentSupabaseClient() {
> 6 |   return createServerComponentClient<Database>({ cookies });
    |                                     ^
  7 | }
  8 |
  9 | export function createRouteHandlerSupabaseClient() {

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
D:\workspace\capston_v001\.next\dev\server\chunks\ssr\node_modules_ec31804d._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at RootLayout (src\app\layout.tsx:47:11)

## Code Frame
  45 |       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  46 |         <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
> 47 |           <Header />
     |           ^
  48 |           <main className="flex-1">
  49 |             {children}
  50 |           </main>

Next.js version: 16.0.3 (Turbopack)
## Error Type
Console Error

## Error Message
D:\workspace\capston_v001\.next\dev\server\chunks\ssr\[root-of-the-server]__27bfbd78._.js: Invalid source map. Only conformant source maps can be used to find the original code. Cause: Error: sourceMapURL could not be parsed


    at RootLayout (src\app\layout.tsx:47:11)

## Code Frame
  45 |       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
  46 |         <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
> 47 |           <Header />
     |           ^
  48 |           <main className="flex-1">
  49 |             {children}
  50 |           </main>

Next.js version: 16.0.3 (Turbopack)
## Error Type
Runtime TypeError

## Error Message
nextCookies.get is not a function

Next.js version: 16.0.3 (Turbopack)
