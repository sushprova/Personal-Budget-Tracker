/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/chartData.js
// src/utils/colors.js

import { Category } from "@prisma/client";

export const assignColorsToCategories = (
  categories: Category[],
  colorPool: string[]
) => {
  return categories.map((category: any, index: number) => ({
    ...category,
    color: colorPool[index % colorPool.length], // Assign colors cyclically
  }));
};

export const prepareDonutDataByType = (
  transactions: any[],
  categoriesWithColors: any[],
  type: any
) => {
  const categoryTotals: { [key: string]: { value: number; color: string } } =
    {};

  transactions
    .filter((tx: { type: any }) => tx.type === type)
    .forEach((tx: { category: { name: any }; amount: any }) => {
      const categoryName = tx.category.name;
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = { value: 0, color: "#000000" };
      }
      categoryTotals[categoryName].value += +tx.amount;
      categoryTotals[categoryName].color =
        categoriesWithColors.find(
          (cat: { name: any }) => cat.name === categoryName
        )?.color || "#000000";
    });

  return Object.keys(categoryTotals).map((categoryName) => ({
    id: categoryName,
    label: categoryName,
    value: categoryTotals[categoryName].value,
    color: categoryTotals[categoryName].color,
  }));
};
