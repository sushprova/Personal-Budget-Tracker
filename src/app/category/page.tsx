"use client";
import { Category } from "@prisma/client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function CategoriesPage() {
  const { selectedHousehold } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{
    name: string;
  }>({
    name: "",
  });

  // Fetch categories on page load
  useEffect(() => {
    async function fetchCategories() {
      try {
        if (!selectedHousehold?.id) {
          console.warn("No household found for user");
          return;
        }

        // Fetch categories based on householdId
        const res = await fetch(
          `/api/categories?householdId=${selectedHousehold.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error: any) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [selectedHousehold]);

  // Handle form submission for new category
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.name,
          householdId: selectedHousehold!.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const createdCategory = await res.json();
      setCategories((prevCategories) => [...prevCategories, createdCategory]); // Update state
      setNewCategory({ name: "" }); // means if a user does not select, it will be debit by default
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Debit Section */}
      <div>
        <h2 className="text-lg font-semibold">Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>

      {/* Credit Section
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Credit Categories</h2>
        <ul>
          {categories
            .filter((category) => category.type === "credit")
            .map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
        </ul>
      </div> */}

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
        {/* <select
          value={newCategory.type}
          onChange={(e) =>
            setNewCategory({
              ...newCategory,
              type: e.target.value as "debit" | "credit",
            })
          }
          className="border p-2 mb-2 w-full"
        >
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select> */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add New
        </button>
      </form>
    </div>
  );
}
