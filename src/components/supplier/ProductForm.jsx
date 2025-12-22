// FILE PATH: src/components/supplier/ProductForm.jsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from '@/components/shared/ImageUploader';
import { PRODUCT_CATEGORIES } from '@/utils/constants';
import toast from 'react-hot-toast';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: product || {
      name: '',
      category: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      sku: '',
      active: true
    }
  });
  
  const watchPrice = watch('price');
  const watchDiscountPrice = watch('discountPrice');
  
  // Calculate discount percentage
  const discountPercent = watchPrice && watchDiscountPrice ?
    Math.round(((watchPrice - watchDiscountPrice) / watchPrice) * 100) :
    0;
  
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        stock: parseInt(data.stock),
        images,
        supplierId: user.uid,
        active: data.active,
        updatedAt: serverTimestamp()
      };
      
      if (product) {
        // Update existing product
        await updateDoc(doc(db, 'products', product.id), productData);
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
          salesCount: 0,
          revenue: 0,
          rating: 0,
          reviewCount: 0
        });
        toast.success('Product added successfully!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Images */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Images *
        </label>
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={5}
          onUploading={setUploading}
        />
        <p className="text-xs text-gray-500 mt-2">
          Upload up to 5 images. First image will be the main product image.
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Product Name"
            required
            {...register('name', { required: 'Product name is required' })}
            error={errors.name?.message}
            placeholder="e.g., Fresh Red Apple"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category *
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Input
            label="SKU (Optional)"
            {...register('sku')}
            placeholder="e.g., PROD-001"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe your product..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="Regular Price"
            type="number"
            step="0.01"
            required
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            error={errors.price?.message}
            placeholder="0.00"
            prefix="Rs."
          />
        </div>

        <div>
          <Input
            label="Discount Price (Optional)"
            type="number"
            step="0.01"
            {...register('discountPrice', {
              min: { value: 0, message: 'Price must be positive' }
            })}
            error={errors.discountPrice?.message}
            placeholder="0.00"
            prefix="Rs."
          />
          {discountPercent > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {discountPercent}% discount
            </p>
          )}
        </div>

        <div>
          <Input
            label="Stock Quantity"
            type="number"
            required
            {...register('stock', { 
              required: 'Stock is required',
              min: { value: 0, message: 'Stock must be 0 or more' }
            })}
            error={errors.stock?.message}
            placeholder="0"
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="active"
          {...register('active')}
          className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
        />
        <label htmlFor="active" className="text-sm font-semibold text-gray-700">
          Active (Product visible to customers)
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting || uploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || uploading}
          loading={submitting}
        >
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;