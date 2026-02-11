## Recipe Card Planner

A dynamic recipe management application designed to streamline meal planning. Users can create detailed recipe cards and organize them across a weekly schedule using intuitive drag-and-drop functionality.

### Core Features
- **Recipe Bank & Sidebar**: A persistent library of your favorite recipes. Create, edit, and drag them directly onto your weekly plan.
- **Interactive Scheduler**: Drag-and-drop interface to organize recipes by days of the week. Move recipes between days or reorder them within a day.
- **Smart Logic**: 
    - **Editable Recipes**: Modify recipes in the bank or customize them for a specific day.
    - **Persistence**: Your weekly plan and recipe bank are automatically saved to your browser's local storage.
- **Visual Feedback**: Smooth entry/exit animations and drag interactions powered by Framer Motion.

### Technical Stack
- **Framework**: React & Next.js
- **State Management**: Redux Toolkit (Global Store with multiple slices)
- **Styling**: React-Bootstrap & Custom CSS Modules
- **Drag & Drop**: @dnd-kit (Robust drag-and-drop primitives)
- **Animations**: Framer Motion
- **Testing**: Jest (Unit tests for Redux logic and critical paths)

### How to run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the application or Vercel Deploy [https://spa-recipes.vercel.app/](https://sparecipes.vercel.app/)

### Testing
Run the test suite with:
```bash
npm test
```
