export default function Topbar({ title = "" }) {
  return (
    <div className="w-full bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full"></div>
        <span>Owner</span>
      </div>
    </div>
  );
}
