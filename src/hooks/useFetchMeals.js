export const useFetchMeals = async ({ query, selectedCategory, selectedArea, setLoading, setRecipes, setError }) => {
  setLoading(true);

  // Don't show any recipes if search box is empty
  if (!query) {
    setRecipes([]);
    return;
  }

  try {
    // API URLs for meal search and ingredient search
    const mealUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    const ingredientUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;

    // Fetch results from both the meal and ingredient endpoints concurrently
    const [mealResponse, ingredientResponse] = await Promise.all([
      fetch(mealUrl),
      fetch(ingredientUrl),
    ]);

    const mealData = await mealResponse.json();
    const ingredientData = await ingredientResponse.json();

    const mealsArr = mealData.meals || [];
    const ingredientsArr = ingredientData.meals || [];

    // Combine results from both queries, making sure there are no duplicates
    let combinedResults = [
      ...mealsArr,
      ...ingredientsArr.filter(item2 => !mealsArr.some(item1 => item1.idMeal === item2.idMeal)),
    ];

    if (combinedResults.length > 0) {
      if (selectedCategory) combinedResults = combinedResults.filter(item => item.strCategory === selectedCategory);
      if (selectedArea) combinedResults = combinedResults.filter(item => item.strArea === selectedArea);

      setRecipes(combinedResults);
      setError("");
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
