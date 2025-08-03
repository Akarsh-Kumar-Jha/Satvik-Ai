function NutritionistStats({ user }) {
  return (
    <div className="flex gap-6 mt-4">
      <div className="p-4 rounded-lg bg-white/10 text-white shadow">
        <div className="text-sm">Recipes Created</div>
        <div className="text-xl font-bold">{user.recipesCreated?.length}</div>
      </div>
      <div className="p-4 rounded-lg bg-white/10 text-white shadow">
        <div className="text-sm">Saved Recipes</div>
        <div className="text-xl font-bold">{user.savedRecipes?.length}</div>
      </div>
    </div>
  );
}
export default NutritionistStats;
