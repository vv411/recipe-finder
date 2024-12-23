export const fetchRandomMeal = async (setRecipes, setLoading, setError) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      
      // Check if data or meals is empty
      if (!data || !data.meals || data.meals.length === 0) {
        console.error("No random meal found or invalid data returned.");
        setError("No surprise meal found.");
        setRecipes([]); // Clear recipes if no meal found
        return;
      }
  
      // Set the recipes with the surprise meal
      setRecipes(data.meals);
    } catch (error) {
      console.error("Error fetching surprise meal:", error);
      setError("Error fetching surprise meal.");
    } finally {
      setLoading(false);
    }
  };