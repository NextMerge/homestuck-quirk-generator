import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'

import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/demo/convex')({
  component: App,
})

function Products() {
  const products = useQuery(api.products.get)

  return (
    <ul>
      {(products || []).map((p) => (
        <li key={p._id}>
          {p.title} - {p.price}
        </li>
      ))}
    </ul>
  )
}

function App() {
  const createProduct = useMutation(api.products.create)

  const handleAddProduct = () => {
    createProduct({
      title: `Product ${Date.now()}`,
      imageId: `img_${Date.now()}`,
      price: Math.floor(Math.random() * 100) + 10,
    })
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button 
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </div>
  )
}
