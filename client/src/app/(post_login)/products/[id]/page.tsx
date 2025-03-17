import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 29.99,
    image: "/images/product-1.jpg",
    description: "A comfortable and stylish classic t-shirt.",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/images/product-2.jpg",
    description: "Sleek and modern slim fit jeans for a sharp look.",
  },
  {
    id: 3,
    name: "Leather Jacket",
    price: 199.99,
    image: "/images/product-3.jpg",
    description: "A timeless leather jacket to elevate your style.",
  },
  {
    id: 4,
    name: "Casual Sneakers",
    price: 79.99,
    image: "/images/product-4.jpg",
    description: "Comfortable and trendy sneakers for everyday wear.",
  },
]

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === Number.parseInt(params.id))

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-600 mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-6">{product.description}</p>
          <Button className="w-full md:w-auto">Add to Cart</Button>
        </div>
      </div>
    </div>
  )
}

