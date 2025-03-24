"use client";
import { Category } from "@prisma/client";
import { useState, useEffect } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", type: "debit" });

  // Fetch categories on page load
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form submission for new category
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (res.ok) {
        const createdCategory = await res.json();
        setCategories([...categories, createdCategory]); // Update the state with the new category
        setNewCategory({ name: "", type: "debit" }); // Reset the form
      } else {
        console.error("Failed to create category");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Debit Section */}
      <div>
        <h2 className="text-lg font-semibold">Debit Categories</h2>
        <ul>
          {categories
            .filter((category) => category.type === "debit")
            .map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
        </ul>
      </div>

      {/* Credit Section */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Credit Categories</h2>
        <ul>
          {categories
            .filter((category) => category.type === "credit")
            .map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
        </ul>
      </div>

      {/* Add New Category Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          className="border p-2 mb-2 w-full"
          required
        />
        <select
          value={newCategory.type}
          onChange={(e) =>
            setNewCategory({ ...newCategory, type: e.target.value })
          }
          className="border p-2 mb-2 w-full"
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add New
        </button>
      </form>
    </div>
  );
}
