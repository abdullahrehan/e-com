"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from "@/app/firebase/config"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const products = [
  { id: 1, name: "Classic T-Shirt", price: 29.99, image: "/images/product-1.jpg" },
  { id: 2, name: "Slim Fit Jeans", price: 59.99, image: "/images/product-2.jpg" },
  { id: 3, name: "Leather Jacket", price: 199.99, image: "/images/product-3.jpg" },
  { id: 4, name: "Casual Sneakers", price: 79.99, image: "/images/product-4.jpg" },
]

export default function ProductsPage() {
  
  const router=useRouter()
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <p className="text-center py-10">Loading...</p>
  }

  if (!user&& sessionStorage.getItem("user")!=="true") {
    return null // Prevents rendering while redirecting
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <Link href={`/products/${product.id}`}>
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
              <Button className="w-full">Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

