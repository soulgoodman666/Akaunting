import Sidebar from '../Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}