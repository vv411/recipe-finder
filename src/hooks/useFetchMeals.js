import { useState, useEffect } from "react";

const MEAL_DB_API_ROOT_URL = "https://www.themealdb.com/api/json/v1/1/";

function useFetchMeals(query, selectedCategory, selectedArea) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setRecipes([]);
      return;
    }

    const fetchMeals = async () => {
      setLoading(true);

      try {
        const mealUrl = MEAL_DB_API_ROOT_URL + `search.php?s=${query}`;
        const ingredientUrl = MEAL_DB_API_ROOT_URL + `filter.php?i=${query}`;

        const [mealResponse, ingredientResponse] = await Promise.all([
          fetch(mealUrl),
          fetch(ingredientUrl),
        ]);

        const mealData = await mealResponse.json();
        const ingredientData = await ingredientResponse.json();

        const mealsArr = mealData.meals || [];
        const ingredientsArr = ingredientData.meals || [];

        let combinedResults = [
          ...mealsArr,
          ...ingredientsArr.filter(item2 => !mealsArr.some(item1 => item1.idMeal === item2.idMeal))
        ];

        if (combinedResults.length > 0) {
          if (selectedCategory) combinedResults = combinedResults.filter(item => item.strCategory === selectedCategory);
          if (selectedArea) combinedResults = combinedResults.filter(item => item.strArea === selectedArea);

          setRecipes(combinedResults);
          setError(null);
        } else {
          setRecipes([]);
        }
      } catch (err) {
        setError("Error: " + err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [query, selectedCategory, selectedArea]);

  return { recipes, loading, error };
}

export default useFetchMeals;