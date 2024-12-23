export const fetchMealById = async (id, setSelectedRecipe, setLoading) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      
      // Check if data or meals is empty
      if (!data || !data.meals || data.meals.length === 0) {
        console.error("No meal found or invalid data returned.");
        setSelectedRecipe(null);
        return;
      }
  
      // Set the selected recipe
      setSelectedRecipe(data.meals[0]);
    } catch (error) {
      console.error("Error fetching meal by ID:", error);
      setSelectedRecipe(null);
    } finally {
      setLoading(false);
    }
};