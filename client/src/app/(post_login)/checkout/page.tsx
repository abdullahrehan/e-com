import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input type="text" id="name" name="name" className="mt-1" required />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Input type="text" id="address" name="address" className="mt-1" required />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <Input type="text" id="city" name="city" className="mt-1" required />
            </div>
            <div className="mb-4">
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <Input type="text" id="zip" name="zip" className="mt-1" required />
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="border-t border-b py-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$89.98</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>$94.98</span>
            </div>
          </div>
          <Link href="/payment">
            <Button className="w-full mt-8">Proceed to Payment</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

