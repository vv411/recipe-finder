Instructions to run the app
1. Clone the repository locally and navigate to the newly created directory
2. Run "npm install" in a terminal
3. Run "npm run dev" in a terminal
4. Access the app in a browser at http://localhost:5173/
5. Enter a search term, such as a meal name or ingredient in the search bar
6. Use the filter dropdowns to filter the results from the search by area of cuisine or category of cuisine.
7. Click on a recipe card to open a modal and see its' detailed info.

Approach used:
The app searches by both meal name and ingredient concurrently, and combines the results of the 2 API calls without duplicates. It then applies filters to the search results
if any are selected. The app does not search if the search bar is empty, as the Meal DB Api only returns a maximum of 25 results per call, so this would not show all available
recipes. The filters are only applied if the user has typed something in the search bar. 

I used Tailwind CSS to implement responsive design using screen size breakpoints for small, medium, and large screens, and Material UI for its modal, buttons, and typography.

Assumptions:
The user has Node version 20 or later installed.