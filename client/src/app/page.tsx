import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Men's Clothing Store",
  description: "Your one-stop shop for men's fashion",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to Men's Fashion</h1>
      </div>

      <div className="relative flex place-items-center">
        <Image src="/images/landing-page-shirt-image.jpg" alt="Men's Fashion" width={800} height={400} priority />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left mt-2">
        <Link
          href="/category/shirts"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">Shirts</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Explore our collection of stylish shirts.</p>
        </Link>

        <Link
          href="/category/pants"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">Pants</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Find the perfect pair of pants for any occasion.</p>
        </Link>

        <Link
          href="/category/accessories"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
        >
          <h2 className="mb-3 text-2xl font-semibold">Accessories</h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">Complete your look with our accessories.</p>
        </Link>
      </div>
    </main>
  )
}

