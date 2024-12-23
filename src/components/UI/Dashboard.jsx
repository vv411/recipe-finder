// src/RecipeSearch.jsx
import { useState , useEffect } from "react";
import RecipeCard from "../RecipeCard";
import RecipeModal from "../RecipeModal";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(true)

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  const MEAL_DB_API_ROOT_URL = "https://www.themealdb.com/api/json/v1/1/";

  //fetch categories and areas on first load
  useEffect(() => {
    const fetchCategoriesAndAreas = async () => {
      try {
        const [areaResponse, categoryResponse] = await Promise.all([
          fetch(MEAL_DB_API_ROOT_URL + "list.php?a=list"),
          fetch(MEAL_DB_API_ROOT_URL + "list.php?c=list"),
        ]);
        const areaData = await areaResponse.json();
        const categoryData = await categoryResponse.json();
        setAreas(areaData.meals || []);
        setCategories(categoryData.meals || []);
      } catch (error) {
        console.error("Error fetching areas and categories:", error);
      }
    };

    fetchCategoriesAndAreas();
  }, []);

  //search meals whenever the query or filter changes
  useEffect(() => {
    fetchMeals();
  }, [query, selectedCategory, selectedArea]);

  const applyCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
  }

  const applyAreaFilter = () => {
    setSelectedArea(event.target.value);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleCardClick = (recipe) => { 
    setSelectedRecipe(recipe); 
    setModalOpen(true); 
  };

  // Fetch meals based on query, areaFilter, and categoryFilter
  const fetchMeals = async () => {
    setLoading(true);

    //Don't show any recipes if search box is empty
    if (!query) {
      setRecipes([]);
      return;
    }

    try {
      // API URLs for meal search and ingredient search
      const mealUrl = MEAL_DB_API_ROOT_URL + `search.php?s=${query}`;
      const ingredientUrl = MEAL_DB_API_ROOT_URL + `filter.php?i=${query}`;  

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
        ...ingredientsArr.filter(item2 => !mealsArr.some(item1 => item1.id === item2.id))
      ];

      if (combinedResults.length > 0) {
        if (selectedCategory != "") combinedResults = combinedResults.filter(item => item.strCategory == selectedCategory);
        if (selectedArea != "") combinedResults = combinedResults.filter(item => item.strArea == selectedArea);

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

  // Handle Surprise Me Button
  const handleSurpriseMe = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        MEAL_DB_API_ROOT_URL + "random.php"
      );
      const data = await response.json();
      const meals = data.meals;

      setRecipes(meals);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-8xl mx-4 md:mx8 lg:mx-16 p-4 text-center">
      {/* Search bar */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipe or ingredient"
          className="w-full p-4 md:w-1/2 lg:w-1/4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Surprise me button */}
        <button onClick={handleSurpriseMe} className="p-4 m-4 bg-blue-500 text-white rounded-md">
          Surprise Me!
        </button>
      </div>

      {/* Filter options */}
      <div className="block lg:inline-block m-4">
        <select
          value={selectedCategory}
          onChange={applyCategoryFilter}
          className="custom-dropdown"
        >
          <option value="">All Categories</option>
          {categories.map((option) => (
            <option key={option.id} value={option.id}>
              {option.strCategory}
            </option>
          ))}
        </select>

        <select
          value={selectedArea}
          onChange={applyAreaFilter}
          className="custom-dropdown"
        >
          <option value="">All Areas</option>
          {areas.map((option) => (
            <option key={option.id} value={option.id}>
              {option.strArea}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard  key={recipe.idMeal} recipe={recipe} onClick={handleCardClick} />
        ))}
      </div>

      {/* No results found */}
      {recipes.length === 0 && !loading && query && (
        <p className="text-center text-gray-500">No results found.</p>
      )}    

      <RecipeModal recipe={selectedRecipe} open={modalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default Dashboard;
