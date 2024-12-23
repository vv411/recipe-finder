// src/components/Dashboard.js
import { useState, useEffect } from "react";
import RecipeCard from "../../RecipeCard";
import RecipeModal from "../../RecipeModal";
import Dropdown from "../elements/Dropdown";
import { useFetchMeals } from "../../../hooks/useFetchMeals";
import { fetchMealById } from "../../../utils/fetchMealById";
import { fetchRandomMeal } from "../../../utils/fetchRandomMeal";

function Dashboard() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');

  const MEAL_DB_API_ROOT_URL = "https://www.themealdb.com/api/json/v1/1/";

  // Fetch categories and areas on first load
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

  // Search meals whenever the query or filter changes
  useEffect(() => {
    useFetchMeals({ query, selectedCategory, selectedArea, setLoading, setRecipes, setError });
  }, [query, selectedCategory, selectedArea]);

  const applyCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
  }

  const applyAreaFilter = (event) => {
    setSelectedArea(event.target.value);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleCardClick = (recipe) => {
    fetchMealById(recipe.idMeal, setSelectedRecipe, setLoading); // Call refactored function
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query){
      setError("Search field cannot be blank.");
    }
  };

  const handleSurpriseMeClick = () => {
    fetchRandomMeal(setRecipes, setLoading, setError); // Call refactored function
  };

  return (
    <div className="max-w-8xl mx-4 md:mx8 lg:mx-16 p-4 text-center">
      {/* Search bar */}
      <div className="inline">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a recipe or ingredient"
            className="w-full p-4 md:w-1/2 lg:w-1/4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Surprise me button */}
        <button onClick={handleSurpriseMeClick} className="px-4 py-2 m-4 bg-blue-500 text-white rounded-md inline">
          Surprise Me!
        </button>
      </div>

      {/* Filter options */}
      <div className="block lg:inline-block m-4">
        <Dropdown
          value={selectedCategory}
          onChange={applyCategoryFilter}
          options={categories}
          defaultLabel="All Categories"
        />
        <Dropdown
          value={selectedArea}
          onChange={applyAreaFilter}
          options={areas}
          defaultLabel="All Areas"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Recipe grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.idMeal} 
            recipe={recipe} 
            onClick={handleCardClick} />
        ))}
      </div>

      {/* No results found */}
      {recipes.length === 0 && !loading && query && (
        <p className="text-center text-gray-500">No results found.</p>
      )}

      <RecipeModal 
        recipe={selectedRecipe} 
        open={modalOpen} 
        onClose={handleCloseModal} />
    </div>
  );
}

export default Dashboard;
