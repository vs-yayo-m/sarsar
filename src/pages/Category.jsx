// ============================================================
// FILE PATH: src/pages/Category.jsx
// ============================================================
import { useParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/customer/ProductCard';
import FilterSidebar from '@/components/customer/FilterSidebar';

const Category = () => {
  const { categoryName } = useParams();
  const { products, loading } = useProducts();
  
  const categoryProducts = products.filter(
    p => p.category.toLowerCase() === categoryName.toLowerCase()
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
          {categoryName}
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterSidebar />
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Category;