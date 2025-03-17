import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>
      <form className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <Input
            type="text"
            id="card-number"
            name="card-number"
            placeholder="1234 5678 9012 3456"
            className="mt-1"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <Input type="text" id="expiry" name="expiry" placeholder="MM/YY" className="mt-1" required />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <Input type="text" id="cvv" name="cvv" placeholder="123" className="mt-1" required />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name on Card
          </label>
          <Input type="text" id="name" name="name" className="mt-1" required />
        </div>
        <Button type="submit" className="w-full">
          Pay $94.98
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/checkout" className="text-blue-600 hover:underline">
          Back to Checkout
        </Link>
      </div>
    </div>
  )
}

