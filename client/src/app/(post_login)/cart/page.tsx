import { Button } from "@/components/ui/button"
import Link from "next/link"

const cartItems = [
  { id: 1, name: "Classic T-Shirt", price: 29.99, quantity: 2, image: "/images/product-1.jpg" },
  { id: 2, name: "Slim Fit Jeans", price: 59.99, quantity: 1, image: "/images/product-3.jpg" },
]

export default function CartPage() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center border-b py-4">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-24 h-24 object-cover mr-4" />
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-600">
              ${item.price.toFixed(2)} x {item.quantity}
            </p>
          </div>
          <Button variant="outline" className="mr-2">
            -
          </Button>
          <span className="mx-2">{item.quantity}</span>
          <Button variant="outline" className="ml-2">
            +
          </Button>
        </div>
      ))}
      <div className="mt-8">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <Link href="/checkout">
          <Button className="mt-4">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  )
}

